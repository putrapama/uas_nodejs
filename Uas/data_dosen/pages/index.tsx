import { useState,useEffect } from "react";
import axios from "axios";
import { stat } from "fs";

 
 const koneksidosen = axios.create({
  
  baseURL: "http://localhost:5000/api/dosen" 
});

export default function Formdosen() {
    const [stateid_dosen, setId_dosen] = useState("");
    const [statenama_dosen, setNama_dosen] = useState("");
    const [statefoto, setfoto] = useState("");
    const [statemata_kuliah, setmata_kuliah] = useState("");
    const [statejadwal_mengajar, setjadwal_mengajar] = useState("");
    const [dosen, setdosen] =  useState(null);  
    const [stateadd,setAdd]=useState("hide");
    const [statebutonadd,setbtnAdd]=useState("show");
    const [stateedit,setEdit]=useState("hide");

     
    

   
  const handleSubmitAdd =  (event) => {
    
    event.preventDefault();
    const formData = new FormData(event.target);
    koneksidosen
      .post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
     
 }
 const handleSubmitEdit =  (event) => {
    
  event.preventDefault();
  const address = "/"+event.target.id_dosen.value;
  //const formData = new FormData(event.target);
  const formData = {
    id_dosen: event.target.id.value,
    nama_dosen: event.target.nama_dosen.value,
    mata_kuliah: event.target.mata_kuliah.value,
    jadwal_mengajar: event.target.jadwal_mengajar.value
    
}
  koneksidosen
    .put( address,formData)
    .then((res) => {
      console.log(res);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
   
}
  const handleAdd = (event) => {
    
     setAdd("show");
     setbtnAdd("hide");
     setEdit("hide");
 
      
  }

   const handleDelete = (event) => {
            event.preventDefault();
            var id_dosen = event.target.value;
            koneksidosen.delete(`/${id_dosen}`)
              .then(response => {
                console.log('Data berhasil dihapus:', response.data);
                window.location.reload();
                setdosen(
                  dosen.filter((dosen) => {
                     return dosen.id_dosen !== id_dosen;
                  }))
             
                // Lakukan langkah-langkah lain setelah penghapusan data
              })
              .catch(error => {
                console.error('Gagal menghapus data:', error);
              })
          }

      const handleEdit = (event) => {
            event.preventDefault();
            var id_dosen = event.target.value;
            
               const sbjEdit =  dosen.filter((dosen) => {
                     return dosen.id_dosen == id_dosen;
                  });
                  if(sbjEdit!=null){

                    setId_dosen(sbjEdit[0].id_dosen);
                    setNama_dosen(sbjEdit[0].nama_dosen);
                    setmata_kuliah(sbjEdit[0].mata_kuliah);
                    setfoto(sbjEdit[0].foto);
                    setjadwal_mengajar(sbjEdit[0].jadwal_mengajar);
                    setAdd("hide");
                    setbtnAdd("show");
                    setEdit("show");

                  }
          }
  useEffect(() => {
      async function getdosen() {
        const response = await koneksidosen.get("/").then(function (axiosResponse) {
            setdosen(axiosResponse.data.data); 
     
         })
         .catch(function (error) {   
          alert('error from dosen in api dosen: '+error);
         });;
          }
      getdosen();
    }, []);
  
   
if(dosen==null){
    return(
    <div>
        waiting...
    </div>
) }else{
  return (
    <center>
    <div className="container">
        <form id="formadd" onSubmit={handleSubmitAdd} className="forminput" >
            <table border={0} style={{marginLeft: "5%"}}>
                <tbody>
                    <tr>
                        <td><label> Id dosen</label></td>
                        <td><input type="text" id="id_dosen" name="id_dosen"/></td>
                    </tr>
                    <tr>
                        <td><label> Nama dosen</label></td>
                        <td><input type="text" id="nama_dosen"   name="nama_dosen" /></td>
                    </tr>
                    <tr>
                        <td><label> Foto </label></td>
                        <td><input type="file" name="image"/>  </td>
                    </tr>
                    <tr>
                        <td><label> mata kuliah</label></td>
                        <td><input type="text" id="mata_kuliah"   name="mata_kuliah" /> </td>
                    </tr>
                    <tr>
                        <td>  <label> jadwal mengajar</label></td>
                        <td>   <input type="text" id= "jadwal mengajar" name="jadwal_mengajar"/></td>
                    </tr>
                </tbody>
            </table>
            <input type="submit" />
        </form>   
        <br/>
        <br/>
       <div className="layout-tabel" style={{color:"#000"}}>
        TABLE DOSEN
    
        <table border={2} style={{alignItems:"center"}} >
            <thead>
                <tr>
                <td><b>Id Dosen</b></td> 
                <td><b>Nama Dosen</b></td>
                <td><b>FOTO</b></td>
                <td><b>Mata Kuliah </b></td>
                <td><b> Jadwal Mengajar</b></td>
                <td colSpan={2}><b>Opsi</b></td>
                </tr>
            </thead>
            <tbody>
            {dosen.map((sbj) =>
                <tr>
                    <td>{sbj.id_dosen}</td>
                    <td>{sbj.nama_dosen}</td>
                    <td><img src={sbj.foto} width="100"/></td>
                    <td>{sbj.mata_kuliah}</td>
                    <td>{sbj.jadwal_mengajar}</td>
                   <td><button onClick={handleEdit} value={sbj.id_dosen}>edit</button></td>
                   <td><button onClick={handleDelete} value={sbj.id_dosen}>delete</button></td>
                </tr>
           )}     
                </tbody>
                </table>
                </div>
                <br />
                <br />
                <form id="formedit" onSubmit={handleSubmitEdit} className="formedit">
            <table border={0} style={{marginLeft: "0%"}}>
                <tbody>
                    <tr>
                        <td><label> Id dosen:</label></td>
                        <td><input type="text" id="id_dosen"  value={stateid_dosen} name="id_dosen" /></td>
                    </tr>
                    <tr>
                        <td>  <label> Nama dosen:</label></td>
                        <td><input type="text" id="nama_dosen"  value={statenama_dosen} name="nama_dosen" onChange={(e) => setNama_dosen(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>  <label> Foto:</label></td>
                        <td>  <img src={statefoto} width="80"/> </td>
                    </tr>
                    <tr>
                        <td>  <label> mata kuliah:</label></td>
                        <td>  <input type="text" value={statemata_kuliah} name="mata_kuliah"  onChange={(e) => setmata_kuliah(e.target.value)}/></td>
                    </tr>
                    <tr>
                        <td>  <label> jadwal mengajar:</label></td>
                        <td>  <input type="text" value={statejadwal_mengajar} name="jadwal_mengajar"  onChange={(e) => setjadwal_mengajar(e.target.value)}/></td>
                    </tr>
                </tbody>
            </table>
            <input type="submit" />
        </form>
    </div>
    </center>
    )
}
}