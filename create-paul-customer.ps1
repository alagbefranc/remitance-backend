# Create Paul Alagbe as a real RemittanceApp user and Nium customer

$baseUrl = "http://localhost:3001"
$authToken = ""

Write-Host "🚀 Creating Paul Alagbe as RemittanceApp User and Nium Customer..." -ForegroundColor Green
Write-Host "Email: alagbepaul2002@gmail.com" -ForegroundColor Cyan
Write-Host ""

# Function to make API calls
function Invoke-APICall {
    param(
        [string]$Method = "GET",
        [string]$Uri,
        [object]$Body = $null,
        [hashtable]$Headers = @{},
        [string]$Description = ""
    )
    
    Write-Host "🧪 $Description" -ForegroundColor Yellow
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
            Write-Host "   Request Body:" -ForegroundColor Cyan
            $Body | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray
        }
        
        $response = Invoke-WebRequest @params
        $content = $response.Content | ConvertFrom-Json
        
        Write-Host "   ✅ SUCCESS ($($response.StatusCode)): $($content.message)" -ForegroundColor Green
        if ($content.data) {
            Write-Host "   📊 Response Data:" -ForegroundColor Cyan
            $content.data | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor White
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
            if ($errorContent.error) {
                $errorMessage += " - Details: $($errorContent.error)"
            }
        } catch {
            # Ignore JSON parsing errors
        }
        
        Write-Host "   ❌ ERROR ($statusCode): $errorMessage" -ForegroundColor Red
        Write-Host ""
        return $null
    }
}

# Step 1: Register Paul as a user
Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
Write-Host "👤 CREATING USER ACCOUNT" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta

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

$registerResponse = Invoke-APICall -Method "POST" -Uri "/api/auth/register" -Body $paulUserData -Description "Registering Paul Alagbe"

if ($registerResponse -and $registerResponse.data.tokens.accessToken) {
    $authToken = $registerResponse.data.tokens.accessToken
    Write-Host "🔑 Auth Token Obtained: $($authToken.Substring(0,20))..." -ForegroundColor Green
    
    $authHeaders = @{
        "Authorization" = "Bearer $authToken"
    }
    
    # Step 2: Get user profile to confirm registration
    Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
    Write-Host "👤 VERIFYING USER PROFILE" -ForegroundColor Magenta
    Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
    
    $profileResponse = Invoke-APICall -Uri "/api/auth/profile" -Headers $authHeaders -Description "Getting Paul's Profile"
    
    if ($profileResponse) {
        Write-Host "✅ User registered successfully!" -ForegroundColor Green
        Write-Host "   User ID: $($profileResponse.data._id)" -ForegroundColor White
        Write-Host "   Email: $($profileResponse.data.email)" -ForegroundColor White
        Write-Host "   Full Name: $($profileResponse.data.firstName) $($profileResponse.data.lastName)" -ForegroundColor White
        Write-Host ""
        
        # Step 3: Create Nium customer profile
        Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
        Write-Host "💳 CREATING NIUM CUSTOMER" -ForegroundColor Magenta
        Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
        
        # We need to create a custom endpoint or use the existing customer creation logic
        # Let's try to get wallets which should trigger customer creation
        $walletResponse = Invoke-APICall -Uri "/api/wallet/wallets" -Headers $authHeaders -Description "Attempting to create Nium customer (via wallet access)"
        
        if ($walletResponse -and $walletResponse.success) {
            Write-Host "✅ SUCCESS! Paul now has a Nium customer profile!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ User created but Nium customer creation needs to be triggered separately" -ForegroundColor Yellow
            
            # Step 4: Test other endpoints
            Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
            Write-Host "🧪 TESTING OTHER ENDPOINTS" -ForegroundColor Magenta
            Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
            
            # Test exchange rates
            Invoke-APICall -Uri "/api/wallet/exchange-rates?from=USD&to=NGN" -Description "Getting USD to NGN exchange rate"
            
            # Test Nium connection
            Invoke-APICall -Uri "/api/wallet/test-nium-connection" -Headers $authHeaders -Description "Testing Nium connection"
            
            # Test debug config
            Invoke-APICall -Uri "/api/wallet/debug-config" -Headers $authHeaders -Description "Checking debug configuration"
        }
        
    } else {
        Write-Host "❌ Failed to verify user profile" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ Failed to register Paul - cannot proceed with Nium customer creation" -ForegroundColor Red
}

Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta
Write-Host "📋 SUMMARY" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════" -ForegroundColor Magenta

if ($registerResponse) {
    Write-Host "✅ User Account: Created successfully" -ForegroundColor Green
    Write-Host "   📧 Email: alagbepaul2002@gmail.com" -ForegroundColor White
    Write-Host "   👤 Name: Paul Alagbe" -ForegroundColor White
    Write-Host "   📱 Phone: +2348123456789" -ForegroundColor White
    Write-Host "   🏠 Location: Lagos, Nigeria" -ForegroundColor White
    
    if ($authToken) {
        Write-Host "✅ Authentication: JWT token generated" -ForegroundColor Green
        Write-Host "   🔑 Token: $($authToken.Substring(0,30))..." -ForegroundColor White
        
        Write-Host "" 
        Write-Host "🎯 NEXT STEPS:" -ForegroundColor Cyan
        Write-Host "1. Paul can now login with email: alagbepaul2002@gmail.com" -ForegroundColor White
        Write-Host "2. Password: SecurePass123!" -ForegroundColor White
        Write-Host "3. Use the mobile app to complete Nium customer onboarding" -ForegroundColor White
        Write-Host "4. Complete KYC verification for full access" -ForegroundColor White
    }
} else {
    Write-Host "❌ Account Creation Failed" -ForegroundColor Red
}

Write-Host "" 
Write-Host "🎉 Paul Alagbe Setup Complete!" -ForegroundColor Green
Write-Host ""
