/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  // Ambil koleksi
  const categories = dao.findCollectionByNameOrId("categories");
  const products = dao.findCollectionByNameOrId("products");

  // Buka akses List dan View untuk Publik
  if (categories) {
    categories.listRule = "";
    categories.viewRule = "";
    dao.saveCollection(categories);
  }

  if (products) {
    products.listRule = "";
    products.viewRule = "";
    dao.saveCollection(products);
  }

}, (db) => {
  const dao = new Dao(db);
  const categories = dao.findCollectionByNameOrId("categories");
  const products = dao.findCollectionByNameOrId("products");

  // Revert kembali ke null (hanya Admin)
  if (categories) {
    categories.listRule = null;
    categories.viewRule = null;
    dao.saveCollection(categories);
  }

  if (products) {
    products.listRule = null;
    products.viewRule = null;
    dao.saveCollection(products);
  }
});