<?php

namespace App\Livewire\Pages;

use Livewire\Attributes\Title;
use Livewire\Component;

class CheckOut extends Component
{
    #[Title('Check Out - DCodeMania')]
    public function render()
    {
        return view('livewire.pages.check-out');
    }
}
