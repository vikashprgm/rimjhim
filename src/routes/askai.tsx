import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { createFileRoute } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { listen } from '@tauri-apps/api/event'
import { toast } from 'sonner'
import { Download, Send } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/askai')({
  component: RouteComponent,
})

type model = {
  name : string,
  modified_at: string,
  size: number,
}

type PullStatus = {
  message : string,
  digest? : string,
  total? : string,
  completed? : string
}


function RouteComponent() {
  const [mod,setMod] = useState<model[]>();
  const [downmod,setDownmod] = useState<string>();
  const [askmod,setAskmod] = useState<string>();
  const [pullStatus, setPullStatus] = useState<PullStatus | null>(null);
  const [prompt,setPrompt] = useState<string>();
  const [stopdownbtn,setStopDownbtn] = useState<boolean>(false);
  const [stopaskbtn,setStopaskbtn] = useState<boolean>(false);
  
  useEffect(
    ()=>{
      async function available_mod(){
        const available_mod:model[] = await invoke('list_models');
        setMod(available_mod)
      }
      available_mod()
    },[setMod]
  )

  // Set up the listener
  useEffect(() => {
    const unlisten = listen<PullStatus>('pull-progress', (event) => {
      setPullStatus(event.payload);
      console.log("Download Progress:", event.payload);
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const calculateProgress = () => {
    if (!pullStatus?.total || !pullStatus?.completed) return 0;
    const total = parseInt(pullStatus.total);
    const completed = parseInt(pullStatus.completed);
    return Math.round((completed / total) * 100);
  };

  return (
    <div className='p-2 grid gap-2'>
      <div className='grid gap-2 border-2 rounded-xl p-2'>
        <div className='text-lg'>
          Ask AI
        </div>
        <div className='flex items-center gap-2 text-sm'>
            Select Model: 
            <Select onValueChange={(e)=>{
                setAskmod(e);
              }}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent position='popper'>
                <SelectGroup>
                <SelectLabel>Model</SelectLabel>
                  {mod?.map((e)=>(<SelectItem value={e.name}>{e.name}</SelectItem>))}
                </SelectGroup>
              </SelectContent>
            </Select>
        </div>
        <Textarea placeholder="Enter your prompt" onChange={(e)=>setPrompt(e.target.value)}/>
        <Button onClick={async()=>{
          try {
            const res= await invoke('search_embd', {slice : prompt, model : askmod});
            console.log(res)
          }
          catch(e){
            console.log(e)
          }
       }}>
          <Send/>
          Ask
          {stopaskbtn && <Spinner/>}
        </Button>
      </div>

      <Separator/>

      <div className='border-2 rounded-xl p-2'>
        <div className="grid gap-2">
          <div className='text-lg'>
            Download Models
          </div>
          <div className='text-gray-400'>
            See available models here: ollama.com/search
          </div>
          <Textarea placeholder="Enter model name, ex- gemma3:270m" onChange={
            (e)=>{setDownmod(e.target.value)
            }
          }/>
          
          {pullStatus && (
          <div className="text-sm text-muted-foreground">
            {pullStatus.total && `${calculateProgress()}%`}
          </div>
          )}
          
          <Button disabled={stopdownbtn} variant={ stopdownbtn ? "ghost" : "default"} onClick={
            async()=>{
              try {
                setPullStatus({ message: "Searching model..." });
                setStopDownbtn(true)
                toast.info("Searching model");
                await invoke('pull_model', { model: downmod });
                toast.success("Download complete!");
                setPullStatus(null);
                setStopDownbtn(false);
              } catch (e) {
                toast.error(`Download failed, ${e}`);
                setPullStatus(null);
                setStopDownbtn(false);
          }
          }}>
            Download Model
            {stopdownbtn && <Spinner/>}
          </Button>
        </div>
      </div>

     <div className='grid pt-2 gap-2 border-2 rounded-xl p-2'>
        <div className='text-lg'>
          Available Models
        </div>
        <div className='gap-1'>
            {mod?.map(
              (e)=><RenderModel {...e}/>
            )}
        </div>
     </div>
  </div>
  )
}

const RenderModel = (model: model)=>{
  return(
    <div className='gap-1 text-sm pb-2'>
      <div>
        Name: {' '}
        {model.name}
      </div>
      <div>
        Size:{' '}{Math.floor(model.size/1048576)}{' '}MB
      </div>
      <Separator/>
    </div>
  )
}

// current invokes - store_embd,
//             search_embd,
//             list_notes, 
//             is_model
