migrate((db) => {
  const dao = new Dao(db);
  const admin = new Admin();
  admin.email = "admin@example.com";
  admin.setPassword("password123");
  dao.saveAdmin(admin);
}, (db) => {
  const dao = new Dao(db);
  try {
    const admin = dao.findAdminByEmail("admin@example.com");
    dao.deleteAdmin(admin);
  } catch (e) {
    // ignore
  }
});
