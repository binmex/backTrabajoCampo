const { pool } = require("../db");

exports.getRotacion = async (req, res) => {
    try {
      const { id,dateInit,dateEnd } = req.params;
      const [inicio] = await pool.query(
        "SELECT (COALESCE((SELECT SUM(quantity_stock) FROM StockMovimiento WHERE date_of_movement <=? AND movement_type = 'entrada' and product_id =?), 0) -COALESCE((SELECT SUM(quantity_stock) FROM StockMovimiento WHERE date_of_movement <= ? AND movement_type = 'salida' and product_id = ?), 0)) as inicioPeriodo",
        [dateInit,id,dateInit,id]
      );
      const [finalizacion] = await pool.query(
        "SELECT (COALESCE((SELECT SUM(quantity_stock) FROM StockMovimiento WHERE date_of_movement <=? AND movement_type = 'entrada' and product_id =?), 0) -COALESCE((SELECT SUM(quantity_stock) FROM StockMovimiento WHERE date_of_movement <= ? AND movement_type = 'salida' and product_id = ?), 0)) as finPeriodo",
        [dateEnd,id,dateEnd,id]
      );

      const [cantVendida] = await pool.query(
        "SELECT COALESCE(SUM(quantity_stock), 0) as cantidadVen FROM StockMovimiento WHERE date_of_movement BETWEEN ? AND ? AND movement_type = 'salida' AND product_id = ?",
        [dateInit,dateEnd,id]
      );
      
      if (inicio.length <= 0) {
        return res.status(404).json({ message: "NO es posible obtener los datos de rotacion" });
      }
      res.send({
        inicio: inicio[0].inicioPeriodo,
        fin: finalizacion[0].finPeriodo,
        cantidad: cantVendida[0].cantidadVen,
        rotacion: Number(cantVendida[0].cantidadVen)/((Number(inicio[0].inicioPeriodo)+Number(finalizacion[0].finPeriodo))/2)
      })
    } catch (error) {
      return res.status(500).json({ message: "something goes wrong: "+error });
    }
  };

  exports.getGanancias = async (req, res) => {
    try {
      const { id, dateInit, dateEnd } = req.params;
  
      // Consulta SQL para calcular la rentabilidad por unidad en el período de tiempo especificado
      const consultaSQL = `
      SELECT COALESCE(
      SUM(v.quantity_sell * p.selling_price),0) AS Ingresos,COALESCE(
      SUM(v.quantity_sell * p.purchase_price),0) AS Costos
    FROM
      Producto p
    JOIN
      Venta v ON p.id_producto = v.product_id
    JOIN
      Factura f ON v.invoice_id = f.id_invoice
    WHERE
      p.id_producto = ?
      AND f.date_of_sell  BETWEEN ? AND ?;
      `;
      const valores = [id, dateInit, dateEnd];
      const consultaFechaVentaSQL = `
      SELECT COALESCE(
      product_id,0),COALESCE (
      date_of_movement,'0000-00-00') AS FechaMax,COALESCE(
      SUM(quantity_stock) ,0)AS Total_Vendido
  FROM
      StockMovimiento
  WHERE
  product_id=? AND
      date_of_movement >= ?
      AND date_of_movement <= ?
      AND movement_type = 'salida'
  GROUP BY
      product_id, date_of_movement
  ORDER BY
      Total_Vendido DESC
  LIMIT 1
  `;
  const [cantVendida] = await pool.query(
    "SELECT COALESCE(SUM(quantity_stock), 0) as cantidadVen FROM StockMovimiento WHERE date_of_movement BETWEEN ? AND ? AND movement_type = 'salida' AND product_id = ?",
    [dateInit,dateEnd,id]
  );
  
      
      const [resultado] = await pool.query(consultaSQL, valores);
       console.log(resultado[0].Ingresos)
       console.log(resultado[0].Costos)
       console.log(cantVendida[0].cantidadVen)
      // Realiza los cálculos necesarios para obtener la rentabilidad por unidad
      const ingresos = resultado[0].Ingresos;
      const inversion = resultado[0].Costos;
      const gananciaNeta=(ingresos - inversion)
      const cantidad=cantVendida[0].cantidadVen;
      const rentabilidadUnidad = (ingresos - inversion) /cantidad;
      console.log(rentabilidadUnidad)
      const [resultadoFechaVenta ]= await pool.query(consultaFechaVentaSQL, valores);
      console.log(resultadoFechaVenta[0].FechaMax)
      const fechaMayor =resultadoFechaVenta[0].FechaMax ;
      
    
      res.json({ rentabilidadUnidad ,gananciaNeta,inversion,fechaMayor});
      
    } catch (error) {
      return res.status(500).json({ message: "something goes wrong: "+error });
    }
  };

  exports.getRotacionGraf = async (req, res) => {
    try {
      const { id,dateInit,dateEnd } = req.params;
      const [inicio] = await pool.query(
        "SELECT (COALESCE((SELECT SUM(quantity_stock) FROM StockMovimiento WHERE date_of_movement <=? AND movement_type = 'entrada' and product_id =?), 0) -COALESCE((SELECT SUM(quantity_stock) FROM StockMovimiento WHERE date_of_movement <= ? AND movement_type = 'salida' and product_id = ?), 0)) as inicioPeriodo",
        [dateInit,id,dateInit,id]
      );
      const [finalizacion] = await pool.query(
        "SELECT (COALESCE((SELECT SUM(quantity_stock) FROM StockMovimiento WHERE date_of_movement <=? AND movement_type = 'entrada' and product_id =?), 0) -COALESCE((SELECT SUM(quantity_stock) FROM StockMovimiento WHERE date_of_movement <= ? AND movement_type = 'salida' and product_id = ?), 0)) as finPeriodo",
        [dateEnd,id,dateEnd,id]
      );

      const [cantVendida] = await pool.query(
        "SELECT COALESCE(SUM(quantity_stock), 0) as cantidadVen FROM StockMovimiento WHERE date_of_movement BETWEEN ? AND ? AND movement_type = 'salida' AND product_id = ?",
        [dateInit,dateEnd,id]
      );
      
      if (inicio.length <= 0) {
        return res.status(404).json({ message: "NO es posible obtener los datos de rotacion" });
      }
      res.send({
        inicio: inicio[0].inicioPeriodo,
        fin: finalizacion[0].finPeriodo,
        cantidad: cantVendida[0].cantidadVen,
        rotacion: Number(cantVendida[0].cantidadVen)/((Number(inicio[0].inicioPeriodo)+Number(finalizacion[0].finPeriodo))/2)
      })
    } catch (error) {
      return res.status(500).json({ message: "something goes wrong: "+error });
    }
  }