# Simple Debug: Nium Customer Creation for Paul Alagbe

$baseUrl = "http://localhost:3001"

Write-Host "DEBUG: Nium Customer Creation for Paul Alagbe" -ForegroundColor Yellow
Write-Host ""

# Login Paul
Write-Host "Step 1: Logging in Paul..." -ForegroundColor Cyan
$loginData = @{
    email = "alagbepaul2002@gmail.com"
    password = "SecurePass123!"
}

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Body ($loginData | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    $authToken = $loginResult.data.tokens.accessToken
    Write-Host "SUCCESS: Login successful" -ForegroundColor Green
    
    $headers = @{ "Authorization" = "Bearer $authToken" }
    
    # Get Paul's current profile
    Write-Host "Step 2: Getting profile..." -ForegroundColor Cyan
    $profileResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/profile" -Headers $headers -UseBasicParsing
    $profileResult = $profileResponse.Content | ConvertFrom-Json
    
    Write-Host "SUCCESS: Profile retrieved" -ForegroundColor Green
    Write-Host "Paul Data:" -ForegroundColor White
    $profileResult.data | ConvertTo-Json -Depth 2 | Write-Host
    
    # Check if Paul has Nium customer
    if ($profileResult.data.niumCustomerHashId) {
        Write-Host "WARNING: Paul already has Nium customer: $($profileResult.data.niumCustomerHashId)" -ForegroundColor Yellow
    } else {
        Write-Host "OK: Paul ready for Nium customer creation" -ForegroundColor Green
    }
    
    # Create Nium customer
    Write-Host "Step 3: Creating Nium customer..." -ForegroundColor Cyan
    try {
        $createResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/create-nium-customer" -Method POST -Headers $headers -UseBasicParsing
        $createResult = $createResponse.Content | ConvertFrom-Json
        
        Write-Host "SUCCESS: Nium customer created!" -ForegroundColor Green
        Write-Host "Customer details:" -ForegroundColor White
        $createResult.data | ConvertTo-Json -Depth 3 | Write-Host
        
        # Test wallet access
        Write-Host "Step 4: Testing wallet access..." -ForegroundColor Cyan
        try {
            $walletResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/wallets" -Headers $headers -UseBasicParsing
            $walletResult = $walletResponse.Content | ConvertFrom-Json
            
            Write-Host "SUCCESS: Wallet access working!" -ForegroundColor Green
            Write-Host "Wallets:" -ForegroundColor White
            $walletResult.data.wallets | ConvertTo-Json -Depth 2 | Write-Host
            
        } catch {
            Write-Host "INFO: Wallet access still blocked - needs KYC" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "ERROR: Failed to create Nium customer" -ForegroundColor Red
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.Value__)" -ForegroundColor Red
        
        # Try to get error details
        if ($_.Exception.Response) {
            try {
                $errorStream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($errorStream)
                $errorContent = $reader.ReadToEnd()
                $reader.Close()
                
                if ($errorContent) {
                    $errorJson = $errorContent | ConvertFrom-Json
                    Write-Host "Error Message: $($errorJson.message)" -ForegroundColor Red
                    if ($errorJson.error) {
                        Write-Host "Error Details: $($errorJson.error)" -ForegroundColor Red
                    }
                } else {
                    Write-Host "No error response content" -ForegroundColor Red
                }
            } catch {
                Write-Host "Could not parse error response" -ForegroundColor Red
                Write-Host "Raw error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
} catch {
    Write-Host "ERROR: Failed to login" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "DEBUG COMPLETE" -ForegroundColor Yellow
