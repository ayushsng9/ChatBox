import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

function Avatar({ userId, name, image, width, height }) {
  const onlineUser = useSelector(state => state?.user?.onlineUser);

  let avatarName = "";

  if (name) {
    const displayName = name?.split(" ");
    if (displayName.length > 1) {
      avatarName = displayName[0][0] + displayName[1][0];
    } else {
      avatarName = displayName[0][0];
    }
  }

  const bgColor = [
    'bg-teal-400',
    'bg-red-400',
    'bg-green-400',
    'bg-yellow-400',
    'bg-cyan-400',
    'bg-sky-400',
    'bg-blue-400'
  ];

  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const getColorIndex = (userId) => {
    if (!userId || typeof userId !== 'string') return 0;
    return Math.abs(hashCode(userId)) % bgColor.length;
  };

  const colorIndex = getColorIndex(userId);
  const isOnline = onlineUser.includes(userId);

  return (
    <div className="relative">
      <div className={`text-slate-800 overflow-hidden relative rounded-full shadow font-bold ${bgColor[colorIndex]}`} style={{ width: width + "px", height: height + "px" }}>
        {
          image ? (
            <img src={image} width={width} height={height} alt={name} className='object-cover w-full h-full rounded-full' />
          ) : (
            name ? (
              <div className={`flex justify-center items-center overflow-hidden rounded-full`} style={{ width: width + "px", height: height + "px" }}>
                {avatarName}
              </div>
            ) : (
              <PiUserCircle size={width} />
            )
          )
        }
      </div>
      {isOnline && (
        <div className='bg-green-600 p-1 absolute bottom-0 right-0 z-10 rounded-full border-2 border-white'></div>
      )}
    </div>
  );
}

export default Avatar;

