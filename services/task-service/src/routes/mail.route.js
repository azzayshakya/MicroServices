const { Router } = require("express");
const { ApiResponse, ApiError } = require("@monorepo/api-response");

function mailRouter(mailer) {
  const router = Router();

  router.post("/mail/test", async (req, res, next) => {
    try {
      const { to, subject, text } = req.body;
      if (!to || !subject || !text) throw ApiError.badRequest("to, subject, text are required");

      const info = await mailer.sendMail({ to, subject, text });
      res.json(ApiResponse(200, { messageId: info.messageId }, "Mail sent"));
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = mailRouter;
