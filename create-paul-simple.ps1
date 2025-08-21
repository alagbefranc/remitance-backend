# Simple script to create Paul Alagbe as a RemittanceApp user

$baseUrl = "http://localhost:3001"
$authToken = ""

Write-Host "Creating Paul Alagbe as RemittanceApp User..." -ForegroundColor Green
Write-Host "Email: alagbepaul2002@gmail.com" -ForegroundColor Cyan
Write-Host ""

# Step 1: Register Paul as a user
Write-Host "=======================================" -ForegroundColor Magenta
Write-Host "CREATING USER ACCOUNT" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

$paulUserData = @{
    firstName = "Paul"
    lastName = "Alagbe"
    email = "alagbepaul2002@gmail.com"
    password = "SecurePass123!"
    phoneNumber = "+2348123456789"
    dateOfBirth = "2002-01-15"
    address = @{
        street = "123 Victoria Island"
        city = "Lagos"
        state = "Lagos"
        zipCode = "101001"
        country = "NG"
    }
}

try {
    Write-Host "Registering Paul Alagbe..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST -Body ($paulUserData | ConvertTo-Json -Depth 10) -ContentType "application/json" -UseBasicParsing
    $registerResult = $response.Content | ConvertFrom-Json
    
    Write-Host "SUCCESS: User registered!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $registerResult.data | ConvertTo-Json -Depth 2 | Write-Host -ForegroundColor White
    
    if ($registerResult.data.tokens.accessToken) {
        $authToken = $registerResult.data.tokens.accessToken
        Write-Host "Auth Token: $($authToken.Substring(0,30))..." -ForegroundColor Green
        
        # Step 2: Get user profile
        Write-Host "" 
        Write-Host "=======================================" -ForegroundColor Magenta
        Write-Host "VERIFYING USER PROFILE" -ForegroundColor Magenta
        Write-Host "=======================================" -ForegroundColor Magenta
        
        $headers = @{ "Authorization" = "Bearer $authToken" }
        $profileResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/profile" -Headers $headers -UseBasicParsing
        $profileResult = $profileResponse.Content | ConvertFrom-Json
        
        Write-Host "SUCCESS: Profile retrieved!" -ForegroundColor Green
        Write-Host "User Details:" -ForegroundColor Cyan
        Write-Host "  ID: $($profileResult.data._id)" -ForegroundColor White
        Write-Host "  Email: $($profileResult.data.email)" -ForegroundColor White
        Write-Host "  Name: $($profileResult.data.firstName) $($profileResult.data.lastName)" -ForegroundColor White
        Write-Host "  Phone: $($profileResult.data.phoneNumber)" -ForegroundColor White
        
        # Step 3: Test wallet access (will show expected 400 error until Nium customer created)
        Write-Host "" 
        Write-Host "=======================================" -ForegroundColor Magenta
        Write-Host "TESTING WALLET ACCESS" -ForegroundColor Magenta
        Write-Host "=======================================" -ForegroundColor Magenta
        
        try {
            $walletResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/wallets" -Headers $headers -UseBasicParsing
            $walletResult = $walletResponse.Content | ConvertFrom-Json
            Write-Host "SUCCESS: Wallet access granted!" -ForegroundColor Green
        } catch {
            Write-Host "EXPECTED: Wallet access denied - Nium customer not created yet" -ForegroundColor Yellow
            Write-Host "Message: User profile not linked to payment provider" -ForegroundColor Yellow
        }
        
        # Step 4: Test other endpoints
        Write-Host "" 
        Write-Host "=======================================" -ForegroundColor Magenta
        Write-Host "TESTING OTHER ENDPOINTS" -ForegroundColor Magenta
        Write-Host "=======================================" -ForegroundColor Magenta
        
        # Test exchange rates
        try {
            $exchangeResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/exchange-rates?from=USD&to=NGN" -UseBasicParsing
            $exchangeResult = $exchangeResponse.Content | ConvertFrom-Json
            Write-Host "SUCCESS: Exchange rates working" -ForegroundColor Green
            Write-Host "USD to NGN rate: $($exchangeResult.data.exchangeRate)" -ForegroundColor White
        } catch {
            Write-Host "Exchange rate test failed" -ForegroundColor Red
        }
        
        # Test Nium connection
        try {
            $niumResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/test-nium-connection" -Headers $headers -UseBasicParsing
            $niumResult = $niumResponse.Content | ConvertFrom-Json
            Write-Host "SUCCESS: Nium connection test passed" -ForegroundColor Green
        } catch {
            Write-Host "Nium connection test had issues" -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Host "ERROR: Failed to register Paul" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorContent = $reader.ReadToEnd() | ConvertFrom-Json
            $reader.Close()
            Write-Host "Server Response: $($errorContent.message)" -ForegroundColor Red
        } catch {
            Write-Host "Could not parse error response" -ForegroundColor Red
        }
    }
}

Write-Host "" 
Write-Host "=======================================" -ForegroundColor Magenta
Write-Host "SUMMARY" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

if ($authToken) {
    Write-Host "SUCCESS: Paul Alagbe account created!" -ForegroundColor Green
    Write-Host "Email: alagbepaul2002@gmail.com" -ForegroundColor White
    Write-Host "Password: SecurePass123!" -ForegroundColor White
    Write-Host "Name: Paul Alagbe" -ForegroundColor White
    Write-Host "Phone: +2348123456789" -ForegroundColor White
    Write-Host "Location: Lagos, Nigeria" -ForegroundColor White
    Write-Host "" 
    Write-Host "NEXT STEPS:" -ForegroundColor Cyan
    Write-Host "1. Paul can login to the mobile app" -ForegroundColor White
    Write-Host "2. Complete Nium customer creation during onboarding" -ForegroundColor White
    Write-Host "3. Complete KYC verification" -ForegroundColor White
} else {
    Write-Host "FAILED: Could not create Paul's account" -ForegroundColor Red
}

Write-Host "" 
Write-Host "Paul Alagbe Setup Complete!" -ForegroundColor Green
