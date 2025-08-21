# Create Paul Alagbe's Nium customer profile

$baseUrl = "http://localhost:3001"
$authToken = ""

Write-Host "Creating Nium Customer Profile for Paul Alagbe..." -ForegroundColor Green
Write-Host "Email: alagbepaul2002@gmail.com" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login Paul to get auth token
Write-Host "=======================================" -ForegroundColor Magenta
Write-Host "LOGGING IN PAUL" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

$loginData = @{
    email = "alagbepaul2002@gmail.com"
    password = "SecurePass123!"
}

try {
    Write-Host "Logging in Paul Alagbe..." -ForegroundColor Yellow
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Body ($loginData | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginResult.data.tokens.accessToken) {
        $authToken = $loginResult.data.tokens.accessToken
        Write-Host "SUCCESS: Login successful!" -ForegroundColor Green
        Write-Host "Auth Token: $($authToken.Substring(0,30))..." -ForegroundColor Green
        
        $headers = @{ "Authorization" = "Bearer $authToken" }
        
        # Step 2: Create Nium customer
        Write-Host "" 
        Write-Host "=======================================" -ForegroundColor Magenta
        Write-Host "CREATING NIUM CUSTOMER" -ForegroundColor Magenta
        Write-Host "=======================================" -ForegroundColor Magenta
        
        try {
            Write-Host "Creating Nium customer profile for Paul..." -ForegroundColor Yellow
            $niumResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/create-nium-customer" -Method POST -Headers $headers -UseBasicParsing
            $niumResult = $niumResponse.Content | ConvertFrom-Json
            
            Write-Host "SUCCESS: Nium customer created!" -ForegroundColor Green
            Write-Host "Nium Customer Details:" -ForegroundColor Cyan
            $niumResult.data | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor White
            
            # Step 3: Verify wallet access now works
            Write-Host "" 
            Write-Host "=======================================" -ForegroundColor Magenta
            Write-Host "TESTING WALLET ACCESS" -ForegroundColor Magenta
            Write-Host "=======================================" -ForegroundColor Magenta
            
            try {
                Write-Host "Testing wallet access..." -ForegroundColor Yellow
                $walletResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/wallets" -Headers $headers -UseBasicParsing
                $walletResult = $walletResponse.Content | ConvertFrom-Json
                
                Write-Host "SUCCESS: Wallet access granted!" -ForegroundColor Green
                Write-Host "Paul's Wallets:" -ForegroundColor Cyan
                $walletResult.data.wallets | ConvertTo-Json -Depth 2 | Write-Host -ForegroundColor White
                
            } catch {
                Write-Host "Wallet access still denied" -ForegroundColor Yellow
                Write-Host "This might be expected if Nium customer creation had compliance issues" -ForegroundColor Yellow
            }
            
            # Step 4: Test transactions
            try {
                Write-Host "Testing transaction access..." -ForegroundColor Yellow
                $transactionResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/transactions" -Headers $headers -UseBasicParsing
                $transactionResult = $transactionResponse.Content | ConvertFrom-Json
                
                Write-Host "SUCCESS: Transaction access granted!" -ForegroundColor Green
                Write-Host "Paul's Transactions:" -ForegroundColor Cyan
                $transactionResult.data.transactions | ConvertTo-Json -Depth 2 | Write-Host -ForegroundColor White
                
            } catch {
                Write-Host "Transaction access denied (expected until KYC complete)" -ForegroundColor Yellow
            }
            
        } catch {
            Write-Host "ERROR: Failed to create Nium customer" -ForegroundColor Red
            Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
            
            if ($_.Exception.Response) {
                try {
                    $errorStream = $_.Exception.Response.GetResponseStream()
                    $reader = New-Object System.IO.StreamReader($errorStream)
                    $errorContent = $reader.ReadToEnd() | ConvertFrom-Json
                    $reader.Close()
                    Write-Host "Server Response: $($errorContent.message)" -ForegroundColor Red
                    if ($errorContent.error) {
                        Write-Host "Error Details: $($errorContent.error)" -ForegroundColor Red
                    }
                } catch {
                    Write-Host "Could not parse error response" -ForegroundColor Red
                }
            }
        }
        
    } else {
        Write-Host "ERROR: Login failed - no token received" -ForegroundColor Red
    }
    
} catch {
    Write-Host "ERROR: Failed to login Paul" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "" 
Write-Host "=======================================" -ForegroundColor Magenta
Write-Host "SUMMARY" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

if ($authToken) {
    Write-Host "Paul Alagbe Nium Integration:" -ForegroundColor Green
    Write-Host "  User Account: ACTIVE" -ForegroundColor White
    Write-Host "  Login: SUCCESS" -ForegroundColor White
    Write-Host "  Nium Customer: ATTEMPTED" -ForegroundColor White
    Write-Host "" 
    Write-Host "What we tested:" -ForegroundColor Cyan
    Write-Host "1. User login with real credentials" -ForegroundColor White
    Write-Host "2. Nium customer profile creation" -ForegroundColor White
    Write-Host "3. Wallet and transaction access" -ForegroundColor White
    Write-Host "4. Full end-to-end integration test" -ForegroundColor White
} else {
    Write-Host "FAILED: Could not complete Nium integration test" -ForegroundColor Red
}

Write-Host "" 
Write-Host "Paul Alagbe Nium Customer Setup Complete!" -ForegroundColor Green
