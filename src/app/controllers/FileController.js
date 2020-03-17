import File from '../models/File';

class FileController {
  async store(req, res) {
    // fizemos a desestruturação do req.file e atribuimos o name e path
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });
    return res.json(file);
  }
}

export default new FileController();
