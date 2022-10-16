import route from 'express';
const router = route.Router();
import File from '../models/file';
import {APP_BASE_URL} from '../config'


router.get('/:uuid', async (req,res) => {
    try {
        const file = await File.findOne({uuid: req.params.uuid});
        console.log(file.uuid);
        if (!file) {
            return res.render('download',{error: "Link has been expired"});           
        }

        return res.render('download', {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${APP_BASE_URL}/files/download/${file.uuid}`,
        });
    }catch(err) {
        // console.log(err);
        return res.render('download',{error: "Something went wrong."});
    }        
});

export default router;