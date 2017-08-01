const storage = new LocalDBStore("testLocalDBStore",{clear:false});

describe("tests",function() {
	it("should clear, get, set, get, delete, get, set, ",done => {
		storage.clear().then(() => {
			storage.getItem("testid").then((data => {
				storage.setItem("testid1","test data").then(() => {
					storage.getItem("testid1").then(data => {
						expect(data.toString()).to.equal("test data");
						storage.removeItem("testid1").then(result => {
							expect(result).to.equal(undefined);
							storage.getItem("testid1").then(data => {
								expect(data).to.equal(undefined);
								storage.setItem("testid1","longer test data").then(() => {
									storage.getItem("testid1").then(data => {
										expect(data).to.equal("longer test data");
										done();
									});
								});
							});
						});
					});
				});
			}))
		});
	});
});