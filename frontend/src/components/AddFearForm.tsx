import {useState} from 'react';
import { createFear } from '../services/fearServices';
import type { Fear } from '../types/Fear';

type AddFearFormProps ={
    onFearCreated: (fear: Fear) => void;
};

function AddFearForm({onFearCreated}: AddFearFormProps){
    const  [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [currentAnxietyLevel, setCurrentAnxietyLevel]= useState(50);

    const handleSubmit = async(event: React.SyntheticEvent<HTMLFormElement>) =>{
        event.preventDefault();
        
        const newFear = await createFear({
            title,
            description,
            currentAnxietyLevel,
        });

        onFearCreated(newFear);
        setTitle('');
        setDescription('');
        setCurrentAnxietyLevel(50);
    };
    return(
        <form className='add-fear-form' onSubmit={handleSubmit}>
            <h3>Add New Fear</h3>
            <input type="text" placeholder='Fear Title' value={title} onChange={(event) => setTitle(event.target.value)} required />
            <textarea placeholder='Description' value={description} onChange={(event) => setDescription(event.target.value)} />
            <label>
                Anxiety Level: {currentAnxietyLevel} / 100
                <input type="range" min='0' max='100' value={currentAnxietyLevel} onChange={(event) => setCurrentAnxietyLevel(Number(event.target.value))} />
            </label>
            <button type="submit">Save Fear</button>
        </form>
    )
}

export default AddFearForm;