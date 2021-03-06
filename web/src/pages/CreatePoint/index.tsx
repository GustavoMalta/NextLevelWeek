import React ,{ useState, useEffect, ChangeEvent,FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { LeafletMouseEvent, LatLng }  from 'leaflet'
import axios from 'axios';

import './styles.css'
import logo from '../../assets/logo.svg';
import  api from  '../../services/api';

interface Item{
    id:number,
    title:string,
    image_url: string,
}
interface ibgeUf{
    sigla:string,
}
interface ibgeCity{
    nome:string,
}

const CreatePoint = ()=>{
    const [loadCities, setLoadCities] = useState<string>('Selecione uma Cidade')
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [formData, setformData] = useState({
        name:"",
        email:"",
        whatsapp:""
    });

    const [inicialLatLng, setinIcialLatLng] = useState<[number,number]>([-20.530926,-47.4038677])
    
    const [selectedUf, setselectedUf] = useState('0');
    const [selectedCity, setselectedCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [latLng, setLatLng] = useState<[number,number]>([0,0])

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position =>{
            const {latitude, longitude } = position.coords
            console.log(position);
            setinIcialLatLng([latitude, longitude])
        })
    }, []);
    useEffect(() => {
        api.get("items").then(res =>{
            setItems(res.data);
            console.log(res);
        })
    }, []);
    useEffect(() => {
        axios.get<ibgeUf[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(res =>{
            setUfs(res.data.map(uf => uf.sigla));
            console.log(ufs);
        })
    }, []);
    useEffect(() => {
        setLoadCities("Carregando Cidades");
        axios.get<ibgeCity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(res =>{
            setCities(res.data.map(city => city.nome));
            console.log(cities);
        setLoadCities("Selecione uma cidade");
        })
    },[selectedUf]);


    function handleSelectUf(event:ChangeEvent<HTMLSelectElement>){
        setselectedUf(event.target.value);
        console.log(event.target.value);
    }
    function handleSelectCity(event:ChangeEvent<HTMLSelectElement>){
        setselectedCity(event.target.value);
        console.log(event.target.value);
    }
    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if(alreadySelected >=0){
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems);
        
        }else{
            setSelectedItems([...selectedItems,  id]);
        }
    }

    function handleMapClick(event: LeafletMouseEvent){
        setLatLng([event.latlng.lat, event.latlng.lng])
        console.log(latLng);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target
        console.log({[name]:value});
        setformData({...formData, [name]:value})
    }

    async function handleSubmit(event : FormEvent){
        event.preventDefault();
        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = latLng;
        const items = selectedItems;

        const data ={
            name, email, whatsapp,
            uf,
            city,
            latitude, longitude,
            items
        };

        await api.post("points",data);

        alert("Ponto de coleta criado");

        history.push('/');

console.log(data);

    }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt=""/>

                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para Home
                </Link>
            </header>

            <form action="" onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}/>
                    </div>
                    <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <input type="text"
                            name="email"
                            id="email"
                            onChange={handleInputChange}/>
                    </div>
                    <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleInputChange}/>
                    </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={inicialLatLng} zoom={12} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={latLng}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf=>(
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">{loadCities}</option>
                                {cities.map(city=>(
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} 
                                onClick={()=>{handleSelectItem(item.id)}}
                                className={selectedItems.includes(item.id)?"selected":''}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                    async
                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>

        </div>
    )
}

export default CreatePoint;