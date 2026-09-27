const { Router } = require("express");
const upload = require("@monorepo/upload-middleware");
const { ApiResponse, ApiError } = require("@monorepo/api-response");

/**
 * uploadRouter(cloudinaryClient) - only mount this when Cloudinary is configured.
 */
function uploadRouter(cloudinaryClient) {
  const router = Router();

  router.post("/upload", upload.single("file"), async (req, res, next) => {
    try {
      if (!req.file) throw ApiError.badRequest("No file provided (field name: 'file')");

      const result = await cloudinaryClient.uploadFile(req.file);
      res.status(201).json(ApiResponse(201, result, "File uploaded"));
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = uploadRouter;
