import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet"; // import component ที่ใช้จัดการกับแผนที่
import axios from "axios"; // ใช้สำหรับดึงข้อมูล API
import "leaflet/dist/leaflet.css"; // import CSS สำหรับ leaflet (เพื่อการแสดงผลแผนที่)
import "./App.css"; // import ไฟล์ CSS ของแอปพลิเคชัน
import L from "leaflet"; // ใช้จัดการ icon ในแผนที่
import Swal from "sweetalert2"; // ใช้แสดงผล popup แจ้งเตือน
import LocationMap from "./components/LocationMap"; // import component LocationMap สำหรับการเลือก location บนแผนที่
//import Login from "./components/Login";

const base_url = import.meta.env.VITE_API_BASE_URL; // ดึงค่า base_url ของ API จาก environment variables

// สร้าง icon สำหรับแสดงผลบนแผนที่ (เช่น ไอคอนโซนส่งสินค้า ไอคอนบ้าน)
const ZoneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/7877/7877890.png", // URL ของไอคอนโซน
  iconSize: [38, 38], // ขนาดของไอคอน
  iconAnchor: [22, 38], // จุดที่ไอคอนจะยึดกับแผนที่
  popupAnchor: [0, -40], // จุดยึดของ popup เมื่อเปิด
});

const houseIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/7720/7720526.png", // URL ของไอคอนบ้าน
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [0, -40],
});

// ไอคอนใหม่สำหรับร้านค้าที่ถูกเลือก (สำหรับโซนส่งสินค้า)
const deliveryZoneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/484/484167.png", // URL ไอคอนร้านค้าเมื่อถูกเลือก
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [0, -40],
});

// โลโก้ที่จะใช้แสดงที่ header
const logo = "https://cdn-icons-png.flaticon.com/256/8890/8890226.png"; // URL Logo

function App() {
  const center = [13.838500199744178, 100.02534412184882];
  const [stores, setStores] = useState([]);
  const [myLocation, setMylocation] = useState({ lat: "", lng: "" });
  const [selectedStore, setSelectedStore] = useState(null); // เก็บร้านค้าที่ถูกเลือก

  const [deliveryZone, setDeliveryZone] = useState({
    lat: null,
    lng: null,
    radius: 1000, // รัศมีโซนส่งสินค้าเริ่มต้นเป็น 1000 เมตร
  });

  // ฟังก์ชันคำนวณระยะทางระหว่างพิกัดสองจุด
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // รัศมีของโลกในหน่วยเมตร
    const phi_1 = (lat1 * Math.PI) / 180; // แปลงละติจูดของพิกัดแรกเป็นเรเดียน
    const phi_2 = (lat2 * Math.PI) / 180; // แปลงละติจูดของพิกัดที่สองเป็นเรเดียน
    const delta_phi = ((lat2 - lat1) * Math.PI) / 180; // คำนวณความแตกต่างของละติจูด
    const delta_lambda = ((lng2 - lng1) * Math.PI) / 180; // คำนวณความแตกต่างของลองจิจูด
    const a =
      Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
      Math.cos(phi_1) *
        Math.cos(phi_2) *
        Math.sin(delta_lambda / 2) *
        Math.sin(delta_lambda / 2); // สูตรคำนวณหาระยะทางระหว่างสองพิกัด
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // ผลลัพธ์ระยะทางในหน่วยเมตร
  };

  // useEffect สำหรับดึงข้อมูลร้านค้าจาก API เมื่อ component ถูกเรียกใช้ครั้งแรก
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${base_url}/api/stores`);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStores();
  }, []);

  // ฟังก์ชันคำนวณว่าร้านค้านี้ถูกเลือกหรือไม่
  const isStoreSelected = (store) => {
    return selectedStore && selectedStore.id === store.id;
  };

  // ฟังก์ชันดึงตำแหน่งปัจจุบันของผู้ใช้
  const handlerGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMylocation({
        lat: position.coords.latitude, // เก็บละติจูดของผู้ใช้
        lng: position.coords.longitude, // เก็บลองจิจูดของผู้ใช้
      });
    });
  };

  // ฟังก์ชันตรวจสอบว่าผู้ใช้เข้าไปในโซนส่งสินค้าหรือไม่
  const handleLocationCheck = () => {
    if (myLocation.lat === "" || myLocation.lng === "") {
      Swal.fire({
        title: "Error!",
        text: "Please Enter your valid location", // แสดงข้อความแจ้งเตือนถ้าตำแหน่งของผู้ใช้ไม่ถูกต้อง
        icon: "error",
        confirmButtonText: "OK!!",
      });
      return;
    }
    
    if (deliveryZone.lat === null || deliveryZone.lng === null) {
      Swal.fire({
        title: "Error!",
        text: "Please Enter the delivery zone", // แสดงข้อความแจ้งเตือนถ้าโซนส่งสินค้ายังไม่ถูกตั้งค่า
        icon: "error",
        confirmButtonText: "OK!!",
      });
      return;
    }

    // คำนวณระยะทางระหว่างตำแหน่งของผู้ใช้กับโซนส่งสินค้า
    const distance = calculateDistance(
      myLocation.lat,
      myLocation.lng,
      deliveryZone.lat, 
      deliveryZone.lng
    );

    if (distance <= deliveryZone.radius) {
      Swal.fire({
        title: "Success",
        text: "You are within the delivery zone", // แสดงข้อความแจ้งเตือนเมื่อผู้ใช้อยู่ในโซนส่งสินค้า
        icon: "success",
        confirmButtonText: "OK!!",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "You are outside the delivery zone", // แสดงข้อความแจ้งเตือนเมื่อผู้ใช้อยู่นอกโซนส่งสินค้า
        icon: "error",
        confirmButtonText: "OK!!",
      });
    }
  };

  return (
    <>
      <div className="header-container">
        <img src={logo} alt="Logo" />
        <h1>
          <span className="color1">STORE DELIVERY</span>
          <span className="color2"> ZONE CHECKER</span>
        </h1>
      </div>
      <div className="button-container">
        <button className="get-location-btn" onClick={handlerGetLocation}>
          Get My Location
        </button>
        <button className="get-location-btn" onClick={handleLocationCheck}>
          Check Delivery Availability
        </button>
      </div>
      <div>
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '85vh', width: '90vw' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {stores.map((store) => (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={isStoreSelected(store) ? deliveryZoneIcon : ZoneIcon}
              eventHandlers={{
                click: () => {
                  setSelectedStore(store);
                },
              }}
            >
              <Popup>
                <b>{store.name}</b>
                <p>{store.address}</p>
                <a href={store.direction}>Get Direction</a>
              </Popup>
            </Marker>
          ))}

          <LocationMap
            myLocation={myLocation}
            icon={houseIcon}
            onLocationSelect={setMylocation}
          />

          {myLocation.lat && myLocation.lng && (
            <Marker position={[myLocation.lat, myLocation.lng]} icon={houseIcon}>
              <Popup>My current location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </>
  );
}

export default App;
            
            