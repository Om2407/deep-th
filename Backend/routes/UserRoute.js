import { useState, useEffect } from 'react';
import Layout from '../../../../layout';
import { Breadcrumb } from '../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../../../config/redux/action';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const DataOvertime = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    const [pegawaiList, setPegawaiList] = useState([]);
    const [formData, setFormData] = useState({
        pegawai_id: '',
        tanggal: '',
        jam_overtime: '',
        alasan: ''
    });
    const [errors, setErrors] = useState({});

    const { pegawai_id, tanggal, jam_overtime, alasan } = formData;

    useEffect(() => { dispatch(getMe()); }, [dispatch]);

    useEffect(() => {
        if (isError) navigate('/login');
        if (user && user.hak_akses !== 'admin') navigate('/dashboard');
    }, [isError, user, navigate]);

    useEffect(() => {
        const fetchPegawai = async () => {
            try {
                const res = await axios.get('http://localhost:5000/data_pegawai');
                setPegawaiList(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchPegawai();
    }, []);

    const validate = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(tanggal);
        inputDate.setHours(0, 0, 0, 0);

        if (!pegawai_id) newErrors.pegawai_id = 'Pilih pegawai terlebih dahulu';
        if (!tanggal) newErrors.tanggal = 'Tanggal wajib diisi';
        else if (inputDate > today) newErrors.tanggal = 'Tanggal tidak boleh di masa depan';
        else {
            const diffDays = Math.floor((today - inputDate) / (1000 * 60 * 60 * 24));
            if (diffDays > 7) newErrors.tanggal = 'Tanggal tidak boleh lebih dari 7 hari yang lalu';
        }

        if (!jam_overtime) newErrors.jam_overtime = 'Jam overtime wajib diisi';
        else if (jam_overtime < 1 || jam_overtime > 6) newErrors.jam_overtime = 'Jam overtime harus antara 1 sampai 6';

        if (!alasan) newErrors.alasan = 'Alasan wajib diisi';
        else if (alasan.length < 10) newErrors.alasan = 'Alasan minimal 10 karakter';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await axios.post('http://localhost:5000/overtime', {
                pegawai_id,
                tanggal,
                jam_overtime: Number(jam_overtime),
                alasan
            });
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data overtime berhasil disimpan',
                timer: 1500,
                showConfirmButton: false
            });
            setFormData({ pegawai_id: '', tanggal: '', jam_overtime: '', alasan: '' });
            setErrors({});
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: error.response?.data?.msg || 'Terjadi kesalahan'
            });
        }
    };

    return (
        <Layout>
            <Breadcrumb pageName="Input Overtime" />
            <div className="flex flex-col gap-9">
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Form Input Overtime Pegawai</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">

                            {/* Pilih Pegawai */}
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Pilih Pegawai <span className="text-meta-1">*</span>
                                </label>
                                <select
                                    name="pegawai_id"
                                    value={pegawai_id}
                                    onChange={handleChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    <option value="">-- Pilih Pegawai --</option>
                                    {pegawaiList.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nama_pegawai}</option>
                                    ))}
                                </select>
                                {errors.pegawai_id && <p className="text-meta-1 text-sm mt-1">{errors.pegawai_id}</p>}
                            </div>

                            {/* Tanggal */}
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Tanggal <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="tanggal"
                                    value={tanggal}
                                    onChange={handleChange}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                {errors.tanggal && <p className="text-meta-1 text-sm mt-1">{errors.tanggal}</p>}
                            </div>

                            {/* Jam Overtime */}
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Jam Overtime <span className="text-meta-1">*</span> <span className="text-gray-400 text-sm">(maks. 6 jam/hari)</span>
                                </label>
                                <input
                                    type="number"
                                    name="jam_overtime"
                                    value={jam_overtime}
                                    onChange={handleChange}
                                    min="1"
                                    max="6"
                                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                    placeholder="Masukkan jam overtime (1-6)"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                {errors.jam_overtime && <p className="text-meta-1 text-sm mt-1">{errors.jam_overtime}</p>}
                            </div>

                            {/* Alasan */}
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Alasan <span className="text-meta-1">*</span> <span className="text-gray-400 text-sm">(min. 10 karakter)</span>
                                </label>
                                <textarea
                                    name="alasan"
                                    value={alasan}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Masukkan alasan overtime..."
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                {errors.alasan && <p className="text-meta-1 text-sm mt-1">{errors.alasan}</p>}
                            </div>

                            <button
                                type="submit"
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                            >
                                Simpan Overtime
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default DataOvertime;