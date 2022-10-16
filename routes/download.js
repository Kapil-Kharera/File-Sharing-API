import route from 'express';
const router = route.Router();
import File from '../models/file';

router.get('/:uuid',async (req,res) => {
    const file = await File.findOne({uuid: req.params.uuid});
    if (!file) {
        return res.render('download',{error: "Link has been expired"});
    }

    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
});

export default router;