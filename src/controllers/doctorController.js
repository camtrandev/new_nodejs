
import doctorService from '../services/doctorService'


const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let doctors = await getTopDoctorHome(limit);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}


module.exports = {
    getTopDoctorHome
}