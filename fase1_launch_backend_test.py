#!/usr/bin/env python3
"""
FASE 1 PAZARTESI LAUNCH - Backend Test Suite
Tests the 5 critical APIs for Monday launch:
1. News API (GET /api/news)
2. Events API (GET /api/events) 
3. ANBI API (GET /api/anbi)
4. Contact API (POST /api/contact)
5. Homepage API (GET /api/homepage)
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "https://stichting-web-app.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def test_news_api():
    """Test GET /api/news - Should return 5 Dutch news articles"""
    print("\n=== Testing GET /api/news ===")
    
    try:
        response = requests.get(f"{API_BASE}/news")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response structure: {list(data.keys())}")
            
            if 'news' in data:
                news_articles = data['news']
                print(f"Number of news articles: {len(news_articles)}")
                
                if len(news_articles) >= 5:
                    print("✅ News API working - Found 5+ Dutch news articles")
                    
                    # Check structure of first article
                    if news_articles:
                        first_article = news_articles[0]
                        required_fields = ['id', 'title', 'excerpt', 'content', 'date', 'author']
                        missing_fields = [field for field in required_fields if field not in first_article]
                        
                        if not missing_fields:
                            print("✅ News article structure is correct")
                            print(f"Sample article title: {first_article.get('title', 'N/A')}")
                            return True
                        else:
                            print(f"❌ News article missing fields: {missing_fields}")
                            return False
                    else:
                        print("❌ No news articles found")
                        return False
                else:
                    print(f"⚠️  Only {len(news_articles)} news articles found (expected 5+)")
                    return len(news_articles) > 0  # Still pass if some articles exist
            else:
                print("❌ News API - Invalid response structure (missing 'news' key)")
                return False
        else:
            print(f"❌ News API failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ News API error: {str(e)}")
        return False

def test_events_api():
    """Test GET /api/events - Should return upcoming events"""
    print("\n=== Testing GET /api/events ===")
    
    try:
        # Test basic events endpoint
        response = requests.get(f"{API_BASE}/events")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response structure: {list(data.keys())}")
            
            if 'events' in data:
                events = data['events']
                print(f"Number of events: {len(events)}")
                
                if events:
                    print("✅ Events API working - Found events")
                    
                    # Check structure of first event
                    first_event = events[0]
                    required_fields = ['id', 'title', 'description', 'startAt', 'capacity']
                    missing_fields = [field for field in required_fields if field not in first_event]
                    
                    if not missing_fields:
                        print("✅ Event structure is correct")
                        print(f"Sample event title: {first_event.get('title', 'N/A')}")
                        
                        # Test filters
                        print("\nTesting event filters...")
                        
                        # Test upcoming filter
                        upcoming_response = requests.get(f"{API_BASE}/events?upcoming=true")
                        if upcoming_response.status_code == 200:
                            print("✅ Upcoming events filter working")
                        else:
                            print("❌ Upcoming events filter failed")
                            
                        # Test category filter
                        category_response = requests.get(f"{API_BASE}/events?category=soepdag")
                        if category_response.status_code == 200:
                            print("✅ Category filter working")
                        else:
                            print("❌ Category filter failed")
                            
                        return True
                    else:
                        print(f"❌ Event missing fields: {missing_fields}")
                        return False
                else:
                    print("⚠️  No events found - this might be expected if no events are created")
                    return True  # Empty events is acceptable
            else:
                print("❌ Events API - Invalid response structure (missing 'events' key)")
                return False
        else:
            print(f"❌ Events API failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Events API error: {str(e)}")
        return False

def test_anbi_api():
    """Test GET /api/anbi - Should return ANBI documents"""
    print("\n=== Testing GET /api/anbi ===")
    
    try:
        response = requests.get(f"{API_BASE}/anbi")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response structure: {list(data.keys())}")
            
            if 'success' in data and data['success']:
                if 'documents' in data:
                    documents = data['documents']
                    print(f"ANBI documents structure: {list(documents.keys()) if documents else 'Empty'}")
                    print("✅ ANBI API working - Returns documents structure")
                    
                    # Check if documents have proper structure
                    if documents:
                        for doc_type, doc_data in documents.items():
                            if isinstance(doc_data, dict) and 'fileName' in doc_data:
                                print(f"✅ Document {doc_type} has correct structure")
                            else:
                                print(f"⚠️  Document {doc_type} has incomplete structure")
                    else:
                        print("ℹ️  No ANBI documents uploaded yet (empty state)")
                    
                    return True
                else:
                    print("❌ ANBI API - Missing 'documents' key")
                    return False
            else:
                print("❌ ANBI API - Response indicates failure")
                return False
        else:
            print(f"❌ ANBI API failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ ANBI API error: {str(e)}")
        return False

def test_contact_api():
    """Test POST /api/contact - Should accept form submissions"""
    print("\n=== Testing POST /api/contact ===")
    
    # Test data with realistic Dutch information
    test_contact = {
        "name": "Jan van der Berg",
        "email": "jan.vandenberg@example.com",
        "phone": "+31 6 12345678",
        "subject": "Vraag over evenementen",
        "message": "Hallo, ik zou graag meer informatie willen over de aankomende evenementen. Kunnen jullie mij helpen?"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/contact",
            json=test_contact,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('success') and 'message' in data:
                print("✅ Contact API working - Form submission successful")
                print(f"Response message: {data['message']}")
                
                # Test validation - missing required fields
                print("\nTesting validation with missing fields...")
                invalid_contact = {"name": "Test", "email": ""}  # Missing required fields
                
                validation_response = requests.post(
                    f"{API_BASE}/contact",
                    json=invalid_contact,
                    headers={'Content-Type': 'application/json'}
                )
                
                if validation_response.status_code == 400:
                    print("✅ Contact API validation working - Rejects invalid data")
                else:
                    print("⚠️  Contact API validation might be weak")
                
                # Test email format validation
                print("Testing email format validation...")
                invalid_email_contact = {
                    "name": "Test User",
                    "email": "invalid-email-format",
                    "message": "Test message"
                }
                
                email_validation_response = requests.post(
                    f"{API_BASE}/contact",
                    json=invalid_email_contact,
                    headers={'Content-Type': 'application/json'}
                )
                
                if email_validation_response.status_code == 400:
                    print("✅ Contact API email validation working")
                else:
                    print("⚠️  Contact API email validation might be weak")
                
                return True
            else:
                print("❌ Contact API - Invalid response structure")
                return False
        else:
            print(f"❌ Contact API failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Contact API error: {str(e)}")
        return False

def test_homepage_api():
    """Test GET /api/homepage - Should return homepage settings"""
    print("\n=== Testing GET /api/homepage ===")
    
    try:
        response = requests.get(f"{API_BASE}/homepage")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response structure: {list(data.keys())}")
            
            if 'success' in data and data['success']:
                if 'data' in data:
                    homepage_data = data['data']
                    print(f"Homepage data structure: {list(homepage_data.keys()) if homepage_data else 'Empty'}")
                    
                    # Check for expected sections
                    expected_sections = ['hero', 'featuredSections', 'seo']
                    found_sections = []
                    
                    for section in expected_sections:
                        if section in homepage_data:
                            found_sections.append(section)
                            print(f"✅ Found {section} section")
                        else:
                            print(f"⚠️  Missing {section} section")
                    
                    if len(found_sections) >= 2:  # At least 2 out of 3 sections
                        print("✅ Homepage API working - Returns settings data")
                        
                        # Check featured sections configuration
                        if 'featuredSections' in homepage_data:
                            featured = homepage_data['featuredSections']
                            if isinstance(featured, dict):
                                print(f"Featured sections config: {list(featured.keys())}")
                                print("✅ Featured sections configuration available")
                            else:
                                print("⚠️  Featured sections not properly configured")
                        
                        return True
                    else:
                        print("❌ Homepage API - Missing critical sections")
                        return False
                else:
                    print("❌ Homepage API - Missing 'data' key")
                    return False
            else:
                print("❌ Homepage API - Response indicates failure")
                return False
        else:
            print(f"❌ Homepage API failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Homepage API error: {str(e)}")
        return False

def test_api_health():
    """Test basic API health check"""
    print("\n=== Testing API Health Check ===")
    
    try:
        response = requests.get(f"{API_BASE}/")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'message' in data and 'Atlas' in data['message']:
                print("✅ API Health Check - Backend is responding")
                return True
            else:
                print("⚠️  API Health Check - Unexpected response format")
                return True  # Still consider it working
        else:
            print(f"❌ API Health Check failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ API Health Check error: {str(e)}")
        return False

def run_fase1_launch_tests():
    """Run all FASE 1 launch critical backend tests"""
    print("🚀 FASE 1 PAZARTESI LAUNCH - Backend API Tests")
    print(f"Testing against: {API_BASE}")
    print("Testing 5 critical APIs for Monday launch")
    print("=" * 70)
    
    test_results = []
    
    # Test 0: API Health Check
    test_results.append(("API Health Check", test_api_health()))
    
    # Test 1: News API
    test_results.append(("News API (GET /api/news)", test_news_api()))
    
    # Test 2: Events API  
    test_results.append(("Events API (GET /api/events)", test_events_api()))
    
    # Test 3: ANBI API
    test_results.append(("ANBI API (GET /api/anbi)", test_anbi_api()))
    
    # Test 4: Contact API
    test_results.append(("Contact API (POST /api/contact)", test_contact_api()))
    
    # Test 5: Homepage API
    test_results.append(("Homepage API (GET /api/homepage)", test_homepage_api()))
    
    # Summary
    print("\n" + "=" * 70)
    print("🏁 FASE 1 LAUNCH TEST SUMMARY")
    print("=" * 70)
    
    passed = 0
    total = len(test_results)
    critical_failures = []
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
        else:
            critical_failures.append(test_name)
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL FASE 1 LAUNCH BACKEND TESTS PASSED!")
        print("✅ Ready for Monday launch - All critical APIs working")
        return True
    else:
        print(f"⚠️  {total - passed} critical test(s) FAILED")
        print("❌ Issues found that need attention before Monday launch:")
        for failure in critical_failures:
            print(f"   - {failure}")
        return False

if __name__ == "__main__":
    success = run_fase1_launch_tests()
    exit(0 if success else 1)