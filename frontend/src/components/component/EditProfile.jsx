import { setUser } from '@/redux/authSlice';
import { USER_API_ENDPOINT } from '@/utils/constant';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


const EditProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState(null);
  const { user } = useSelector(store => store.auth)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (event) => {
    const file = event?.target?.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("bio", bio);
    form.append("gender", gender);
    if (image) {
      form.append("profilePicture", image);
    }

    try {
      setLoading(true)
      const res = await axios.post(`${USER_API_ENDPOINT}/profile/edit`, form, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });
      if (res?.data?.success) {
        navigate(`/profile/${res?.data?.user?._id}`)
        dispatch(setUser(res?.data?.user))
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    setBio(user?.bio || '');
    setGender(user?.gender || '');
    // setImage(user?.profilePicture || null);
  }, [user]);


  return (
    <div className="flex justify-center items-center mx-auto h-screen bg-gray-50 p-4">
      <div className="w-[30vw] min-w-[300px] bg-white p-8 rounded-lg shadow-lg sm:p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center items-center mb-6">
            <div className="relative">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div>
                  <input
                    type="file"
                    id="image"
                    hidden
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image">
                    <img
                      className="w-24 h-24 border border-x-2 border-y-2 border-blue-600 rounded-full object-cover"
                      src={user?.profilePicture || "https://cdn.pixabay.com/photo/2016/01/03/00/43/upload-1118929_1280.png"}
                      alt="Upload Icon"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-semibold mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e?.target?.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your bio here..."
              rows="2"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-semibold mb-2">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e?.target?.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full flex items-center font-semibold justify-center gap-1 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >{
                loading ? <Loader2 className=' h-5 w-5 animate-spin ' /> : <></>
              }
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
