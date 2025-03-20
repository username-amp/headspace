<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_can_be_updated()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/settings/password')
            ->put('/settings/password', [
                'current_password' => 'password',
                'password' => 'X9k#mP2$vL5nQ8',
                'password_confirmation' => 'X9k#mP2$vL5nQ8',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/settings/password');

        $this->assertTrue(Hash::check('X9k#mP2$vL5nQ8', $user->refresh()->password));
    }

    public function test_correct_password_must_be_provided_to_update_password()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/settings/password')
            ->put('/settings/password', [
                'current_password' => 'wrong-password',
                'password' => 'X9k#mP2$vL5nQ8',
                'password_confirmation' => 'X9k#mP2$vL5nQ8',
            ]);

        $response
            ->assertSessionHasErrors('current_password')
            ->assertRedirect('/settings/password');
    }
}
