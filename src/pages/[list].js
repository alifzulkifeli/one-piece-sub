// pages/list.js
import { supabase } from '../utils/supabase';
import fs from 'fs';
import path from 'path';
import { useState } from 'react'; // Import useState hook from React

export async function getServerSideProps({  params }) {
  console.log("params", params);
  // Construct the file path
  const filePath = path.join(process.cwd(), 'public', 'data', params.list);
  // Read the file content
  const content = fs.readFileSync(filePath, 'utf8');
  // Split the content by new lines to create an array of items
  const items = content.split('\n');
  let { data: known_words, error } = await supabase.from('known_words').select('word')
  return {
    props: {
      items,known_words 
    },
  };
}   

export default function ListPage({ items , known_words}) {
  // Convert items to state variable
  let known_words_list = known_words.map((item) => item.word)
  const [listItems, setListItems] = useState(items.map((item, index) => ({ id: index, content: item })).filter(item => !known_words_list.includes(item.content)));

  // Define the deleteItem function
  const deleteItem = async (id, contents) => {
    // Filter out the item with the matching id

    if (window.confirm('Are you sure you want to delete this item?')) {
        // Filter out the item with the matching id
        setListItems(listItems.filter(item => item.id !== id));
        
        console.log('Updated list:', contents);
        const { data, error } = await supabase
        .from('known_words')
        .insert([
            { word: contents },
        ])
        .select()
    }
  };

  const handleCopyClick = async (txtCopy) => {
    try {
      // Check if navigator.clipboard is supported in the browser
      if (navigator.clipboard) {
        // Copy the text to the clipboard
        await navigator.clipboard.writeText(txtCopy);
  
      } 
    
    } catch (error) {
        console.error('Failed to copy!', error);
        }
    }
 
  return (
    <div>
      <div className='p-4' ><a href='/' className='text-center ' >⬅️</a></div>
      


      <ul>
        {listItems.map(item => (
            // Display the item content if it is not a known word
          <div key={item.id} className='grid grid-cols-7 border border-1 gap-2'>
            <div className='pl-4 p-2 col-span-6' onClick={() => handleCopyClick(item.content)} >{item.content}</div>
            <button onClick={() => deleteItem(item.id, item.content)} className='pl-4 p-2 col-span-1 text-center'>🗑️</button>
          </div>
        ))}
      </ul>
    </div>
  );
}
