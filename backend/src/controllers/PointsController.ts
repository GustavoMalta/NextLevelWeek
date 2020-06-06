import {Request, Response, response} from 'express'
import knex from '../database/connection';

class PointsController{
    async create (req:Request,res:Response){

        const trx = await knex.transaction();

        const {
            image,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body

        const point = {
            image:"Default.png",
            name: String(name).toLowerCase(),
            email:String(email).toLowerCase(),
            whatsapp,
            latitude,
            longitude,
            city: String(city).toLowerCase(),
            uf: String(uf).toLowerCase(),
        }
        const insertedIDs = await trx("points").insert(point);
    
        const point_id = insertedIDs[0];
        
        const point_items = items.map((item_id:number) =>{
            return{
                item_id,
                point_id,
            };
        })
        await trx("point_item").insert(point_items);

        await trx.commit();
        return res.json({id:point_id, ...point})
                
            
    };

    async index (req:Request,res:Response){
        const {city, uf, items} = req.query 

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))
        
        const points = await knex("points")
            .join("point_item" , "points.id" , "=" , "point_item.point_id")
            .whereIn("point_item.item_id" , parsedItems)
            .where("city", String(city).toLowerCase())
            .where("uf", String(uf).toLowerCase())
            .distinct()
            .select("points.*");

        console.log( String(city).toLowerCase())
        return res.json(points);


    }

    async show (req:Request,res:Response){
        const {id}= await req.params;

        const point = await knex("points").where("id", id).first();

        console.log(point)
        if(!point){
            return res.status(400).json({message: "point not Found"})
        }

        const items = await knex("items")
            .join("point_item" , "items.id" , "=" , "point_item.item_id")
            .where("point_item.point_id" , "=" , id);
        return res.json({point,items});
    }

}

export default PointsController;