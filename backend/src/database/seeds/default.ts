import Knex from 'knex';

export async function seed(knex: Knex){
    await knex('items').insert([
        {title:"Lampadas", image: "lampadas.svg"},
        {title:"Pilhas e Baterias", image: "baterias.svg"},
        {title:"Papeis e Papelão", image: "papeis-papelao.svg"},
        {title:"Resíduos Eletrônicos", image: "eletronicos.svg"},
        {title:"Resíduos Organicos", image: "organicos.svg"},
        {title:"Óleo", image: "oleo.svg"},
    ]);
}