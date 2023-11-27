const { pool } = require("../db");

exports.getFacturas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "select id_invoice, date_of_sell,value_sold,name_product,selling_price,quantity_sell from Factura inner join Venta on(invoice_id=id_invoice) inner join Producto on(product_id=id_producto)"
    );
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong"+error});
  }
};

exports.getFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "select id_invoice, date_of_sell,value_sold,name_product,selling_price,quantity_sell from Factura inner join Venta on(invoice_id=id_invoice) inner join Producto on(product_id=id_producto) where id_invoice = ? and invoice_id = ?",
      [id, id]
    );
    if (rows.length <= 0) {
      return res.status(404).json({ message: "Factura not found" });
    }
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

exports.getProductos = async(req,res) => {
  try{
    const [rows] = await pool.query("select * from Producto");
    if(rows.length <= 0){
      return res.status(404).send({
        status: "error",
        message: "no se logro hacer la consulta"
      })
    }
    res.json(rows);

  }catch(error){
    res.send({
      status: "error",
      message: error
    })
  }
};

exports.addVenta = async (req,res) => {
  try {
   

    const params = req.body;
    

   
    console.log(params[0].product_id)
    
   

    //let cantidad2 = 1;
    let robin = "robin"
    const [row] = await pool.query(
      "INSERT INTO Factura (date_of_sell,admin_name) VALUES ( NOW(), ?)",
      [robin]
    );
    if (row.length <= 0) {
      return res.status(404).json({ message: "factura no creada" });
    }

    for (let index = 0; index < params.length; index++) {
      

      const [rows] = await pool.query(
        "INSERT INTO Venta (product_id,invoice_id,quantity_sell,value_sold) VALUES ( ?,?,?,?)",
    
        [ params[index].product_id,row.insertId,params[index].quantity_sell,params[index].selling_price*params[index].quantity_sell]
      );
      if (rows.length <= 0) {
        return res.status(404).json({ message: "Venta no creada" });
      }
    }

    res.status(200).send({
      message: "se añadio la venta correctamente"
    })
  } catch (er) {
    return res.status(500).json({ message: "Something goes wrong", error: er});
  }
};
