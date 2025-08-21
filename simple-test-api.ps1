# RemittanceApp API Test Script - Simple Version

$baseUrl = "http://localhost:3001"
$testEmail = "postman.test$(Get-Random -Maximum 9999)@example.com"
$testPassword = "SecurePass123"
$authToken = ""

Write-Host "Starting RemittanceApp API Tests..." -ForegroundColor Green
Write-Host "Base URL: $baseUrl" -ForegroundColor Cyan
Write-Host "Test Email: $testEmail" -ForegroundColor Cyan
Write-Host ""

# Function to make API calls
function Test-APIEndpoint {
    param(
        [string]$Method = "GET",
        [string]$Uri,
        [object]$Body = $null,
        [hashtable]$Headers = @{},
        [string]$Description = ""
    )
    
    Write-Host "Testing: $Description" -ForegroundColor Yellow
    Write-Host "   $Method $Uri" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = "$baseUrl$Uri"
            Method = $Method
            UseBasicParsing = $true
            Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        $content = $response.Content | ConvertFrom-Json
        
        Write-Host "   SUCCESS ($($response.StatusCode)): $($content.message)" -ForegroundColor Green
        if ($content.data) {
            Write-Host "   Response Data:" -ForegroundColor Cyan
            $content.data | ConvertTo-Json -Depth 2 | Write-Host -ForegroundColor Gray
        }
        Write-Host ""
        return $content
        
    } catch {
        $statusCode = "Unknown"
        $errorMessage = $_.Exception.Message
        
        try {
            $statusCode = $_.Exception.Response.StatusCode.Value__
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorContent = $reader.ReadToEnd() | ConvertFrom-Json
            $reader.Close()
            if ($errorContent.message) {
                $errorMessage = $errorContent.message
            }
        } catch {}
        
        Write-Host "   ERROR ($statusCode): $errorMessage" -ForegroundColor Red
        Write-Host ""
        return $null
    }
}

Write-Host "=======================================" -ForegroundColor Magenta
Write-Host "HEALTH AND INFO ENDPOINTS" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

Test-APIEndpoint -Uri "/health" -Description "Health Check"
Test-APIEndpoint -Uri "/" -Description "API Info"

Write-Host "=======================================" -ForegroundColor Magenta
Write-Host "AUTHENTICATION ENDPOINTS" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

# Register User
$registerBody = @{
    firstName = "Test"
    lastName = "User"
    email = $testEmail
    password = $testPassword
    phoneNumber = "+1234567890"
    dateOfBirth = "1990-01-01"
    address = @{
        street = "123 Test St"
        city = "Test City"
        state = "TS"
        zipCode = "12345"
        country = "US"
    }
}

$registerResponse = Test-APIEndpoint -Method "POST" -Uri "/api/auth/register" -Body $registerBody -Description "Register User"
if ($registerResponse -and $registerResponse.data.tokens.accessToken) {
    $authToken = $registerResponse.data.tokens.accessToken
    Write-Host "   Auth Token Received: $($authToken.Substring(0,20))..." -ForegroundColor Green
}

# Login User
$loginBody = @{
    email = $testEmail
    password = $testPassword
}

$loginResponse = Test-APIEndpoint -Method "POST" -Uri "/api/auth/login" -Body $loginBody -Description "Login User"
if ($loginResponse -and $loginResponse.data.tokens.accessToken) {
    $authToken = $loginResponse.data.tokens.accessToken
    Write-Host "   Updated Auth Token: $($authToken.Substring(0,20))..." -ForegroundColor Green
}

# Protected endpoints with authentication
if ($authToken) {
    $authHeaders = @{
        "Authorization" = "Bearer $authToken"
    }
    
    # Get User Profile
    Test-APIEndpoint -Uri "/api/auth/profile" -Headers $authHeaders -Description "Get User Profile"
    
    # Update User Profile
    $updateBody = @{
        firstName = "Updated"
        lastName = "TestUser"
    }
    
    Test-APIEndpoint -Method "PUT" -Uri "/api/auth/profile" -Body $updateBody -Headers $authHeaders -Description "Update User Profile"

    Write-Host "=======================================" -ForegroundColor Magenta
    Write-Host "WALLET OPERATIONS" -ForegroundColor Magenta
    Write-Host "=======================================" -ForegroundColor Magenta

    # Wallet Operations
    Test-APIEndpoint -Uri "/api/wallet/wallets" -Headers $authHeaders -Description "Get User Wallets"
    Test-APIEndpoint -Uri "/api/wallet/transactions" -Headers $authHeaders -Description "Get All Transactions"
    Test-APIEndpoint -Uri "/api/wallet/beneficiaries" -Headers $authHeaders -Description "Get Beneficiaries"

    Write-Host "=======================================" -ForegroundColor Magenta
    Write-Host "EXCHANGE RATES" -ForegroundColor Magenta
    Write-Host "=======================================" -ForegroundColor Magenta

    # Exchange Rates (public endpoints)
    Test-APIEndpoint -Uri "/api/wallet/exchange-rates?from=USD&to=EUR" -Description "USD to EUR Exchange Rate"
    Test-APIEndpoint -Uri "/api/wallet/exchange-rates?from=USD&to=CAD" -Description "USD to CAD Exchange Rate" 
    Test-APIEndpoint -Uri "/api/wallet/exchange-rates?from=GBP&to=USD" -Description "GBP to USD Exchange Rate"

    Write-Host "=======================================" -ForegroundColor Magenta
    Write-Host "DEBUG AND TESTING ENDPOINTS" -ForegroundColor Magenta
    Write-Host "=======================================" -ForegroundColor Magenta

    # Debug endpoints
    Test-APIEndpoint -Uri "/api/wallet/test-nium-connection" -Headers $authHeaders -Description "Test Nium Connection"
    Test-APIEndpoint -Uri "/api/wallet/debug-config" -Headers $authHeaders -Description "Debug Configuration"

    Write-Host "=======================================" -ForegroundColor Magenta
    Write-Host "ERROR TESTING" -ForegroundColor Magenta
    Write-Host "=======================================" -ForegroundColor Magenta

    # Error Testing
    $invalidLoginBody = @{
        email = "invalid@example.com"
        password = "wrongpassword"
    }
    Test-APIEndpoint -Method "POST" -Uri "/api/auth/login" -Body $invalidLoginBody -Description "Invalid Login"

    # Test without auth token
    Test-APIEndpoint -Uri "/api/auth/profile" -Description "Unauthorized Access (No Token)"

    # Invalid exchange rate
    Test-APIEndpoint -Uri "/api/wallet/exchange-rates?from=INVALID&to=EUR" -Description "Invalid Currency Code"

    # Non-existent endpoint  
    Test-APIEndpoint -Uri "/api/nonexistent" -Description "Non-existent Endpoint"

} else {
    Write-Host "Could not obtain auth token, skipping protected endpoints" -ForegroundColor Red
}

Write-Host "=======================================" -ForegroundColor Magenta
Write-Host "TESTING COMPLETE!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Magenta
Write-Host ""
