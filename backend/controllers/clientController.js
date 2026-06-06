const Client = require("../models/Client");


// ========= CREATE CLIENT =============//
exports.createClient = async (req, res) => {

    try {

        const existingClient = await Client.findOne({
            email: req.body.email
        });

        if (existingClient) {

            return res.status(400).json({
                message: "Client already exists"
            });

        }

        const client = new Client(req.body);

        await client.save();

        res.status(201).json(client);

    } catch (error) {
        res.status(500).json({
            message: "Error creating client",
            error: error.message,
        });

    }
};


// ========== GET ALL CLIENTS ==========//
exports.getClients = async (req, res) => {
  try {

    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching clients",
      error: error.message,
    });
  }
};


// =============== GET ON CLIENT ==============//
exports.getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id || id.length !== 24) {
            return res.status(400).json({
                message: "Invalid client ID",
            });
        }
        const client = await Client.findById(id);
        if(!client) {
            return res.status(404).json({
                message: "Client not found",
            });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching client",
            error: error.message,
        });
    }
};


// ============= UPDATE CLIENT =============== //
exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new : true }
        );
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({
            message: "Error updating client",
            error: error.message,
        });
    }
};


// =============== DELETE CLIENT ================ //
exports.deleteClient = async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Client deleted"});
    } catch (error){
        res.status(500).json({
            message: "Error deleting client",
            error: error.message,
        });
    }
};