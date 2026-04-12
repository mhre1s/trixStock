const RequestService = require("../services/RequestService");

class RequestController {
  async store(req, res) {
    try {
      const request = await RequestService.createRequest({
        ...req.body,
        user_id: req.userId,
      });
      return res.status(201).json({
        message: "Solicitação enviada com sucesso!",
        request,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    try {
      const requests = await RequestService.getRequest(req.userId, req.userLevel);
      return res.status(200).json(requests);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async approve(req, res) {
    try {
      const { id } = req.params;
      const approvedRequest = await RequestService.approveRequest(id);

      return res.status(200).json({
        message: "Requisição aprovada! O estoque foi atualizado.",
        approvedRequest,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async reject(req, res) {
    try {
      const { id } = req.params;
      const rejectedRequest = await RequestService.rejectRequest(id);

      return res.status(200).json({
        message: "Requisição rejeitada com sucesso.",
        rejectedRequest,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new RequestController();
