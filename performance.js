import { IndexedDB } from "./indexeddb";

function initPerformanceDB(db, oldVersion, newVersion) {
  console.log(`Upgrading database from ${oldVersion} to ${newVesrion}`);
  switch (oldVersion) {
    case 0: {
      const navigation = db.createObjectStore("navigation", {
        keyPath: "date",
      });
      const resource = db.createObjectStore("resource", {
        keyPath: "id",
        autoIncrement: true,
      });

      navigation.createIndex("dateIdx", "date", { unique: false });
      resource.createIndex("nameIdx", "name", { unique: false });
    }
    case 1: {
      const resource = db.transaction.objectStore("resource");
      resource.createIndex("durationIdx", "duration", { unique: false });
    }
  }
}

window.addEventListener("load", async () => {
  const perfDB = IndexedDB("performance", 1, initPerformanceDB);
});

//save navigation info
const date = new Date(),
  nav = Object.assign(
    { date },
    performance.getEntriesByName("navigation")[0].toJSON()
  );

await perfDb.update("navigation", nav);

//save resource info
const res = performance.getEntriesByName("resource").map((r) => {
  Object.assign({ date }, r.toJSON());
});

await perfDB.update("resource", res);

//get
perfDB.fetch("navigation", null, new Date(2020), new Date(2021), (cursor) => {
  if (cursor) {
    console.log(cursor.value.domContentLoadedEventEnd);
    cursor.continue();
  }
});
