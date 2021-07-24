export class IndexedDB {
  constructor(dbName, dbVersion, dbUpgrade) {
    this.db = null;

    if (!("indexedDB" in window)) reject("not support");
    const dbOpen = indexedDB.open(dbName, dbVersion);

    if (dbUpgrade) {
      dbOpen.onupgradeneeded = (e) => {
        dbUpgrade(dbOpen.result, e.oldVersion, e.newVersion);
      };
    }

    dbOpen.onsuccess = () => {
      this.db = dbOpen.result;
      resolve(this);
    };

    dbOpen.onerror = (e) => {
      reject(e);
    };

    dbOpen.onversionchange = () => {
      dbOpen.close();
      alert("Database upgrading is required");
      location.reload();
    };
  }

  update(storeName, value, overwrite = false) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      value = Array.isArray(value) ? value : [value];

      value.forEach((e) => {
        if (overwrite) store.put(e);
        else store.add(v);
      });

      transaction.oncomplete = () => {
        resolve(true);
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  }

  get(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, "readonly");
      resource = transaction.objectStore("resource");
      request = resource.get(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  fetch(storeName, indexName, lowerBound = null, upperBound = null, callback) {
    const request = this.index(storeName, indexName).openCursor(
      this.bound(lowerBound, upperBound)
    );
    request.onsuccess = () => {
      if (callback) callback(request.result);
    };

    request.onerror = () => {
      return request.error;
    };
  }

  index(storeName, indexName) {
    const transaction = this.db.transaction(storeName),
      store = transaction.objectStore(storeName);
    return indexName ? store.index(indexName) : store;
  }

  bound(lowerBound, upperBound) {
    if (lowerBound && upperBound)
      return IDBKeyRange.bound(lowerBound, upperBound);
    else if (lowerBound) return IDBKeyRange.lowerBound(lowerBound);
    else if (upperBound) return IDBKeyRange.upperBound(upperBound);
  }
}
