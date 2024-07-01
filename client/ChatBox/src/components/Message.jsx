import Avatar from "./Avatar";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";
import { FaAngleLeft, FaPlus, FaImage, FaVideo, FaDownload } from "react-icons/fa";
import upload from "../helpers/upload";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import wallpaper from "../assets/wallpaper.jpg";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

function Message() {
  const params = useParams();
  const socketConnection = useSelector(state => state.user.socketConnection);
  const user = useSelector(state => state?.user);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  });

  const [openMedia, setOpenMedia] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    image: "",
    video: ""
  });

  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const current = useRef(null);

  useEffect(() => {
    if (current.current) {
      current.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);

  const handleSendMedia = () => {
    setOpenMedia(prev => !prev);
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const photo = await upload(file);
    setLoading(false);
    setMessage(prev => ({
      ...prev,
      image: photo.url
    }));
  }

  const handleClearImage = async () => {
    setMessage(prev => ({
      ...prev,
      image: ""
    }));
  }

  const handleSendVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const video = await upload(file);
    setLoading(false);
    setMessage(prev => ({
      ...prev,
      video: video.url
    }));
  }

  const handleClearVideo = async () => {
    setMessage(prev => ({
      ...prev,
      video: ""
    }));
  }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);
      socketConnection.emit('seen', params.userId);

      socketConnection.on('message-user', (data) => {
        setUserData(data);
      });

      socketConnection.on('message', (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage(prev => ({
      ...prev,
      text: value
    }));
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.image || message.video) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params?.userId,
          text: message?.text,
          image: message?.image,
          video: message?.video,
          msgByUserId: user._id
        });
        setMessage({
          text: "",
          image: "",
          video: ""
        });
      }
    }
  }

  const handleDownloadImage = (imageUrl) => {
    const anchor = document.createElement('a');
    anchor.href = imageUrl;
    anchor.download = 'image';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  const handleDownloadVideo = (videoUrl) => {
    const anchor = document.createElement('a');
    anchor.href = videoUrl;
    anchor.download = 'video';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  return (
    <div style={{ background: `url(${wallpaper})` }} className="bg-contain bg-no-repeat">
      <header className="sticky top-0 bg-white h-16 flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar width={50} height={50} image={userData.image} name={userData.name} id={userData._id} />
          </div>
          <div>
            <h3 className="font-semibold text-ellipsis line-clamp-1 text-lg">{userData?.name}</h3>
            <p className='text-sm'>
              {
                userData.online ? <span className='text-green-600'>online</span> : <span className='text-slate-400'>offline</span>
              }
            </p>
          </div>
        </div>
      </header>

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll relative bg-slate-400 bg-opacity-20">
        <div className="flex flex-col gap-2 mx-5" ref={current} >
          {
            allMessage && allMessage.map((msgg, index) => (
              <div key={index} className={`bg-white p-1 my-3 py-2 rounded-md w-fit max-w-[280px] md:max-w-sm lg:max-w-sm ${user._id === msgg.msgByUserId ? "ml-auto bg-green-100" : ""}`}>
                <div>
                  {
                    msgg?.image && (
                      <div className="relative">
                        <img src={msgg?.image} className="w-full h-full object-scale-down" />
                        <button className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-75" onClick={() => handleDownloadImage(msgg?.image)}>
                          <FaDownload size={18} />
                        </button>
                      </div>
                    )
                  }
                  {
                    msgg?.video && (
                      <div className="relative">
                        <video src={msgg?.video} className="w-full h-full object-scale-down" controls />
                        <button className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-75" onClick={() => handleDownloadVideo(msgg?.video)}>
                          <FaDownload size={18} />
                        </button>
                      </div>
                    )
                  }
                </div>
                <p className="px-2 break-words overflow-wrap break-word max-h-40 overflow-y-auto">{msgg.text}</p>
                <p className="text-xs ml-auto w-fit">{moment(msgg.createdAt).format('hh:mm')}</p>
              </div>
            ))
          }
        </div>

        {
          message.image && (
            <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
              <div className="w-fit p-2 absolute z-10 top-2 right-2 cursor-pointer hover:text-red-600" onClick={handleClearImage}>
                <IoClose size={30} />
              </div>
              <div className="bg-white p-3 max-w-sm mx-auto">
                <div className="relative">
                  <img src={message.image} alt="image" className="w-full h-full object-scale-down" />
                  <button className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-75" onClick={() => handleDownloadImage(message.image)}>
                    <FaDownload size={18} />
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {
          message.video && (
            <div className="w-full h-full bg-slate-700 sticky bottom-0 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
              <div className="w-fit p-2 absolute z-10 top-2 right-2 cursor-pointer hover:text-red-600" onClick={handleClearVideo}>
                <IoClose size={30} />
              </div>
              <div className="bg-white p-3 max-w-sm mx-auto">
                <div className="relative">
                  <video src={message.video} alt="video" className="w-full h-full object-scale-down" controls />
                  <button className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-75" onClick={() => handleDownloadVideo(message.video)}>
                    <FaDownload size={18} />
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {
          loading &&
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        }
      </section>

      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button onClick={handleSendMedia} className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-sky-400 hover:text-white">
            <FaPlus />
          </button>
          {
            openMedia && (
              <div className="bg-white shadow rounded absolute bottom-16 w-36 p-2">
                <form>
                  <label htmlFor="sendImage" className="flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer rounded">
                    <div>
                      <FaImage size={18} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label htmlFor="sendVideo" className="flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer rounded">
                    <div>
                      <FaVideo size={18} />
                    </div>
                    <p>Video</p>
                  </label>
                  <input type="file" id="sendImage" onChange={handleSendImage} className="hidden" />
                  <input type="file" id="sendVideo" onChange={handleSendVideo} className="hidden" />
                </form>
              </div>
            )
          }
        </div>
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input type="text" placeholder="Type a message" className="py-1 px-4 outline-none w-full h-full" value={message.text} onChange={handleOnChange} />
          <button className="mr-1 hover:text-sky-600">
            <IoMdSend size={25} />
          </button>
        </form>
      </section>
    </div>
  );
}

export default Message;
