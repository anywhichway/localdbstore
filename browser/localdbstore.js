(function() {
	"use strict";
	
	function LocalDBStore(name,options={clear:false}) {
		let resolver, rejector, objectstore;
		this.options = Object.assign({},options);
		this.options.clear = (typeof(options.clear)==="boolean" ? options.clear : false);
		this.opened = new Promise((resolve,reject) => { resolver = resolve; rejector = reject;});
		const me = this,
			request = indexedDB.open(name); // use levelDB on server?
		request.onupgradeneeded = (event) => {
			me.store = event.target.result;
			objectstore = me.store.createObjectStore("keyvaluepairs", { keyPath: "id" });
		}
		request.onsuccess = (event) => {
			if(objectstore) {
				objectstore.transaction.complete = (event) => {
					if(options.clear) {
						me.clear().then(() => {
							resolver();
						})
					} else {
						resolver();
					}	
				}
			} else {
				me.store = event.target.result;
				if(options.clear) {
					me.clear().then(() => {
						resolver();
					})
				} else {
					resolver();
				}
			}
		}
	}
	LocalDBStore.prototype.clear = async function() {
		const me = this;
		return this.opened.then(() => {
			return new Promise((resolve,reject) => {
				const transaction = me.store.transaction(["keyvaluepairs"],"readwrite"),
					objectstore = transaction.objectStore("keyvaluepairs"),
					request = objectstore.clear();
				request.onsuccess = () => {
					resolve();
				}
			});
		});
	}
	LocalDBStore.prototype.count = async function() {
		const me = this;
		return this.opened.then(() => {
			return new Promise((resolve,reject) => {
				const transaction = me.store.transaction(["keyvaluepairs"],"readwrite"),
					objectstore = transaction.objectStore("keyvaluepairs"),
					request = objectstore.count();
				request.onsuccess = () => {
					resolve(request.result);
				}
			});
		});
	}
	LocalDBStore.prototype.delete = async function(id) {
		const me = this;
		return new Promise((resolve,reject) => {
			const transaction = me.store.transaction(["keyvaluepairs"],"readwrite"),
				objectstore = transaction.objectStore("keyvaluepairs"),
				request = objectstore.delete(id);
			request.onsuccess = () => {
				resolve();
			}
			request.onerror = () => {
				resolve();
			}
		})
	}
	LocalDBStore.prototype.removeItem = LocalDBStore.prototype.delete;
	LocalDBStore.prototype.get = async function(id) {
		const me = this;
		return this.opened.then(() => {
			return new Promise((resolve,reject) => {
				const now = Date.now(),
					version = 1,
					transaction = this.store.transaction(["keyvaluepairs"],"readwrite"),
					objectstore = transaction.objectStore("keyvaluepairs"),
					request = objectstore.get(id);
				request.onsuccess = (event) => {
					resolve(event.target.result ? event.target.result.data : undefined);
				}
			});
		});
	}
	LocalDBStore.prototype.getItem = LocalDBStore.prototype.get;
	LocalDBStore.prototype.key = async function(number) {
		return await this.apply("key",[number]);
	}
	LocalDBStore.prototype.set = async function(id,data) {
		const me = this;
		return this.opened.then(() => {
			return new Promise((resolve,reject) => {
				const transaction = me.store.transaction(["keyvaluepairs"],"readwrite"),
					objectstore = transaction.objectStore("keyvaluepairs"),
					request = objectstore.put({id,data});
				request.onsuccess = (event) => {
					resolve();
				}
			});
		});
	}
	LocalDBStore.prototype.setItem = LocalDBStore.prototype.set;

	window.LocalDBStore = LocalDBStore;	
}).call(this);