<?php

namespace App\Livewire;

use GeminiAPI\Laravel\Facades\Gemini;
use Livewire\Component;

class Test extends Component
{
    public $text;
    public $message;
public function save(){
    $chat = Gemini::startChat();
    if($this->text){
        $this->message = $chat->sendMessage($this->text);
    }
    else{
        $this->message = null;
    }
}

    public function render()
    {
        return view('livewire.test',[
            'content' => $this->message
        ]);
    }
}
