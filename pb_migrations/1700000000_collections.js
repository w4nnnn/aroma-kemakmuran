/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);

  const collection1 = new Collection({
    "id": "categories00000",
    "name": "categories",
    "type": "base",
    "system": false,
    "schema": [
      { "system": false, "id": "cat_name000", "name": "name", "type": "text", "required": true, "options": { "min": null, "max": null, "pattern": "" } },
      { "system": false, "id": "cat_slug000", "name": "slug", "type": "text", "required": true, "options": { "min": null, "max": null, "pattern": "" } }
    ],
    "indexes": ["CREATE UNIQUE INDEX `idx_cat_slug` ON `categories` (`slug`)"],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
  });

  const collection2 = new Collection({
    "id": "products0000000",
    "name": "products",
    "type": "base",
    "system": false,
    "schema": [
      { "system": false, "id": "prod_name00", "name": "name", "type": "text", "required": true, "options": { "min": null, "max": null, "pattern": "" } },
      { "system": false, "id": "prod_slug00", "name": "slug", "type": "text", "required": true, "options": { "min": null, "max": null, "pattern": "" } },
      { "system": false, "id": "prod_cat000", "name": "category", "type": "relation", "required": true, "options": { "collectionId": "categories00000", "cascadeDelete": false, "minSelect": null, "maxSelect": 1, "displayFields": null } },
      { "system": false, "id": "prod_price0", "name": "price", "type": "number", "required": true, "options": { "min": null, "max": null, "noDecimal": true } },
      { "system": false, "id": "prod_desc00", "name": "description", "type": "editor", "required": false, "options": { "convertUrls": false } },
      { "system": false, "id": "prod_img000", "name": "image", "type": "file", "required": false, "options": { "mimeTypes": ["image/jpeg", "image/png", "image/webp"], "thumbs": [], "maxSelect": 1, "maxSize": 5242880, "protected": false } },
      { "system": false, "id": "prod_shop00", "name": "shopee_url", "type": "url", "required": false, "options": { "exceptDomains": [], "onlyDomains": [] } },
      { "system": false, "id": "prod_active", "name": "is_active", "type": "bool", "required": false, "options": {} }
    ],
    "indexes": ["CREATE UNIQUE INDEX `idx_prod_slug` ON `products` (`slug`)"],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
  });

  dao.saveCollection(collection1);
  dao.saveCollection(collection2);
}, (db) => {
  const dao = new Dao(db);
  const products = dao.findCollectionByNameOrId("products0000000");
  const categories = dao.findCollectionByNameOrId("categories00000");
  dao.deleteCollection(products);
  dao.deleteCollection(categories);
});
