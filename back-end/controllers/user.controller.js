
export const getProfile = async (req, res) => {
  const { id } = req.user;
  const result = await pool.query("SELECT id, name, email FROM customers WHERE id = $1", [id]);
  res.json(result.rows[0]);
};
