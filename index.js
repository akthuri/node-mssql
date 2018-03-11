const async = require('async')
const sql = require('mssql')
const config = {
	user: 'sa',
	password: 'SAPB1Admin',
	server: 'WIN-TR0HMI56UON',
	database: 'SBOPruebaMX',
	pool: {
		min: 3,
		max: 20
	}
}

const state = {
	pool: null
}

function crearPool (callback) {
	const pool = new sql.ConnectionPool(config)
	pool.connect()
		.then((resultado) => {
			console.log('Pool creado!')
			state.pool = pool
			callback(null)
		})
		.catch((err) => {
			callback(err)
		})	
}

function ejecutarQuery (callback) {
	const request = state.pool.request()
	const consulta = 'SELECT TOP 10 itemCode FROM OITM'

	request.query(consulta, function (err, result) {
		if (err) {
			callback(err)
			return
		}

		result.recordset.forEach(function (producto) {
			console.log(producto.itemCode)
		})

		callback(null)
	})
}

function complete (err, resultado) {
	if (err) {
		console.log(err)
	}


	if (state.pool !== null) {
		state.pool.close()
	}

	process.exit()
}

async.series([crearPool, ejecutarQuery], complete)
