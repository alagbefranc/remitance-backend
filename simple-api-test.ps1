# RemittanceApp API Test Script
# Tests all endpoints with proper error handling

# Configuration
$BaseUrl = "http://localhost:3001"
$TestUser = @{
    firstName = "Paul"
    lastName = "Alagbe"
    email = "paul.alagbe@example.com"
    phoneNumber = "+1234567890"
    password = "SecurePass123!"
}

# Global variables for test session
$AuthToken = ""
$UserId = ""

function Invoke-APITest {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [string]$Description = ""
    )
    
    try {
        $fullUri = if ($Uri.StartsWith("http")) { $Uri } else { "$BaseUrl$Uri" }
        
        Write-Host ""
        Write-Host "Testing: $Description" -ForegroundColor Cyan
        Write-Host "   $Method $Uri" -ForegroundColor Gray
        
        $requestParams = @{
            Uri = $fullUri
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body -ne $null) {
            $requestParams.Body = ($Body | ConvertTo-Json -Depth 10)
            Write-Host "   Body: $($requestParams.Body)" -ForegroundColor Gray
        }
        
        $response = Invoke-RestMethod @requestParams
        
        Write-Host "SUCCESS: $($response.message)" -ForegroundColor Green
        
        if ($response.data) {
            Write-Host "   Data: $($response.data | ConvertTo-Json -Compress)" -ForegroundColor Yellow
        }
        
        return $response
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode
            Write-Host "   Status: $statusCode" -ForegroundColor Red
            
            try {
                $errorStream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($errorStream)
                $errorBody = $reader.ReadToEnd()
                $errorData = $errorBody | ConvertFrom-Json
                Write-Host "   Error: $($errorData.message)" -ForegroundColor Red
            } catch {
                Write-Host "   Could not parse error response" -ForegroundColor Red
            }
        }
        return $null
    }
}

# Start testing
Write-Host "REMITTANCEAPP API TESTING" -ForegroundColor Magenta
Write-Host "=================================================="

# 1. Health Check
Write-Host ""
Write-Host "HEALTH AND INFO ENDPOINTS" -ForegroundColor Magenta
Invoke-APITest -Uri "/health" -Description "Health Check"
Invoke-APITest -Uri "/" -Description "API Info"

# 2. User Registration
Write-Host ""
Write-Host "USER AUTHENTICATION FLOW" -ForegroundColor Magenta
$registerResponse = Invoke-APITest -Uri "/api/auth/register" -Method "POST" -Body $TestUser -Description "Register New User"

if ($registerResponse) {
    Write-Host "User registered successfully" -ForegroundColor Green
    $UserId = $registerResponse.data.userId
} else {
    Write-Host "Registration failed - continuing with login attempt" -ForegroundColor Yellow
}

# 3. User Login
$loginBody = @{
    email = $TestUser.email
    password = $TestUser.password
}

$loginResponse = Invoke-APITest -Uri "/api/auth/login" -Method "POST" -Body $loginBody -Description "User Login"

if ($loginResponse -and $loginResponse.data.tokens.accessToken) {
    $AuthToken = $loginResponse.data.tokens.accessToken
    $UserId = $loginResponse.data.user._id
    Write-Host "Authentication successful - Token received" -ForegroundColor Green
} else {
    Write-Host "Authentication failed - cannot continue with protected endpoints" -ForegroundColor Red
    Write-Host "Login response: $($loginResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Yellow
    exit 1
}

# Headers for authenticated requests
$AuthHeaders = @{
    "Authorization" = "Bearer $AuthToken"
    "Content-Type" = "application/json"
}

# 4. Protected Authentication Endpoints
Write-Host ""
Write-Host "PROTECTED AUTHENTICATION ENDPOINTS" -ForegroundColor Magenta
Invoke-APITest -Uri "/api/auth/profile" -Headers $AuthHeaders -Description "Get User Profile"

$updateProfileBody = @{
    firstName = "Paul Updated"
    phoneNumber = "+1987654321"
}
Invoke-APITest -Uri "/api/auth/profile" -Method "PUT" -Headers $AuthHeaders -Body $updateProfileBody -Description "Update User Profile"

# 5. Wallet Operations
Write-Host ""
Write-Host "WALLET OPERATIONS" -ForegroundColor Magenta
Invoke-APITest -Uri "/api/wallet/wallets" -Headers $AuthHeaders -Description "Get User Wallets"
Invoke-APITest -Uri "/api/wallet/transactions" -Headers $AuthHeaders -Description "Get Transactions"

# 6. Exchange Rates
Write-Host ""
Write-Host "EXCHANGE RATES" -ForegroundColor Magenta
Invoke-APITest -Uri "/api/wallet/exchange-rates?from=USD&to=EUR" -Headers $AuthHeaders -Description "USD to EUR Rate"
Invoke-APITest -Uri "/api/wallet/exchange-rates?from=USD&to=CAD" -Headers $AuthHeaders -Description "USD to CAD Rate"
Invoke-APITest -Uri "/api/wallet/exchange-rates?from=GBP&to=USD" -Headers $AuthHeaders -Description "GBP to USD Rate"

# 7. Beneficiaries
Write-Host ""
Write-Host "BENEFICIARY MANAGEMENT" -ForegroundColor Magenta
Invoke-APITest -Uri "/api/wallet/beneficiaries" -Headers $AuthHeaders -Description "Get Beneficiaries"

# 8. Nium Customer Creation
Write-Host ""
Write-Host "NIUM INTEGRATION" -ForegroundColor Magenta
Invoke-APITest -Uri "/api/wallet/create-customer" -Method "POST" -Headers $AuthHeaders -Description "Create Nium Customer Profile"

# 9. Money Transfer
Write-Host ""
Write-Host "MONEY TRANSFER" -ForegroundColor Magenta
$sendMoneyBody = @{
    beneficiaryId = "mock_beneficiary_123"
    amount = 100.00
    sourceCurrency = "USD"
    destinationCurrency = "EUR"
    purpose = "Family support"
}
Invoke-APITest -Uri "/api/wallet/send-money" -Method "POST" -Headers $AuthHeaders -Body $sendMoneyBody -Description "Send Money Transfer"

# 10. Error Testing
Write-Host ""
Write-Host "ERROR HANDLING TESTS" -ForegroundColor Magenta
Invoke-APITest -Uri "/api/auth/profile" -Description "Unauthorized Access (No Token)"
Invoke-APITest -Uri "/nonexistent" -Description "404 Not Found"

# Test Summary
Write-Host ""
Write-Host "TEST SUMMARY" -ForegroundColor Magenta
Write-Host "=================================================="
Write-Host "API testing completed" -ForegroundColor Green
Write-Host "Server: $BaseUrl" -ForegroundColor Cyan
Write-Host "Test User: $($TestUser.email)" -ForegroundColor Cyan
Write-Host "User ID: $UserId" -ForegroundColor Cyan
if ($AuthToken) {
    Write-Host "Auth Token: $($AuthToken.Substring(0, 20))..." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "READY FOR FRONTEND INTEGRATION!" -ForegroundColor Green
