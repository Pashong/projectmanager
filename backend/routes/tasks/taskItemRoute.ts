import { Router } from "express";
import { pool } from "../../database/database";


const router = Router();


router.delete("/:id", async (req , res ) => {
    try{
        const taskItemId =  req.params.id;

        const result = await pool.query(`delete from public.task_items where id = $1 `, [taskItemId]);

        if(result.rowCount === 0){
            res.status(404).json({message: "No taskitem found"});
        }

        res.status(200).json({message: "Taskitem delted"});
    }   
    catch(error){
        console.log(error);
    }
})


export default router;