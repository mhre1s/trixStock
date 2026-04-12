const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userLevel) {
      return res.status(401).json({ error: "Nível de usuário não encontrado" });
    }

    if (!allowedRoles.includes(req.userLevel)) {
      return res.status(403).json({ error: "Acesso negado: você não tem permissão para esta ação." });
    }

    next();
  };
};

module.exports = roleMiddleware;
