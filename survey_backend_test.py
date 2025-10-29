#!/usr/bin/env python3
"""
Backend Test Suite for Stichting Atlas Survey System API
Tests the Global Survey System functionality including surveys and responses
"""

import requests
import json
import uuid
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://stichting-atlas-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Test data storage
test_survey_ids = []
test_response_ids = []

def create_test_survey_data(module="career", expired=False):
    """Create test survey data"""
    end_date = None
    if expired:
        end_date = (datetime.now() - timedelta(days=1)).isoformat()
    elif not expired and module != "career":  # Add future end date for some tests
        end_date = (datetime.now() + timedelta(days=30)).isoformat()
    
    return {
        "title": f"Test Survey - {module.title()}",
        "description": f"This is a test survey for {module} module",
        "module": module,
        "questions": [
            {
                "id": "q1",
                "text": "How would you rate this experience?",
                "type": "rating",
                "options": ["1", "2", "3", "4", "5"],
                "required": True
            },
            {
                "id": "q2", 
                "text": "What is your feedback?",
                "type": "textarea",
                "options": [],
                "required": False
            },
            {
                "id": "q3",
                "text": "Would you recommend this?",
                "type": "yes-no",
                "options": ["Yes", "No"],
                "required": True
            }
        ],
        "image": "https://example.com/survey-image.jpg",
        "endDate": end_date
    }

def create_test_response_data(survey_id):
    """Create test response data"""
    return {
        "surveyId": survey_id,
        "answers": [
            {
                "questionId": "q1",
                "question": "How would you rate this experience?",
                "answer": "5"
            },
            {
                "questionId": "q2",
                "question": "What is your feedback?", 
                "answer": "Great experience overall!"
            },
            {
                "questionId": "q3",
                "question": "Would you recommend this?",
                "answer": "Yes"
            }
        ],
        "userName": "Test User",
        "userEmail": "test@example.com"
    }

def test_get_surveys_empty():
    """Test GET /api/surveys - Should return empty array initially"""
    print("\n=== Testing GET /api/surveys (empty state) ===")
    
    try:
        response = requests.get(f"{API_BASE}/surveys")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and isinstance(data.get('data'), list):
                print("✅ GET /api/surveys working - returns empty array")
                return True
            else:
                print("❌ GET /api/surveys - Invalid response structure")
                return False
        else:
            print(f"❌ GET /api/surveys failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ GET /api/surveys error: {str(e)}")
        return False

def test_post_survey_valid():
    """Test POST /api/surveys with valid data"""
    print("\n=== Testing POST /api/surveys (valid data) ===")
    
    modules = ["career", "education", "projects"]
    results = []
    
    for module in modules:
        print(f"\nTesting survey creation for module: {module}")
        
        survey_data = create_test_survey_data(module)
        
        try:
            response = requests.post(
                f"{API_BASE}/surveys",
                json=survey_data,
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    survey = data['data']
                    if 'id' in survey and survey.get('module') == module:
                        print(f"✅ POST /api/surveys working for {module}")
                        test_survey_ids.append(survey['id'])
                        results.append(True)
                    else:
                        print(f"❌ POST /api/surveys - Invalid survey data for {module}")
                        results.append(False)
                else:
                    print(f"❌ POST /api/surveys - Invalid response for {module}")
                    results.append(False)
            else:
                print(f"❌ POST /api/surveys failed for {module} with status {response.status_code}")
                results.append(False)
                
        except Exception as e:
            print(f"❌ POST /api/surveys error for {module}: {str(e)}")
            results.append(False)
    
    return all(results)

def test_post_survey_invalid():
    """Test POST /api/surveys with invalid data"""
    print("\n=== Testing POST /api/surveys (invalid data) ===")
    
    test_cases = [
        {
            "name": "Missing title",
            "data": {
                "description": "Test description",
                "module": "career",
                "questions": [{"id": "q1", "text": "Test?", "type": "text", "required": True}]
            },
            "expected_status": 400
        },
        {
            "name": "Missing module",
            "data": {
                "title": "Test Survey",
                "description": "Test description", 
                "questions": [{"id": "q1", "text": "Test?", "type": "text", "required": True}]
            },
            "expected_status": 400
        },
        {
            "name": "Empty questions array",
            "data": {
                "title": "Test Survey",
                "description": "Test description",
                "module": "career",
                "questions": []
            },
            "expected_status": 400
        },
        {
            "name": "Missing questions",
            "data": {
                "title": "Test Survey", 
                "description": "Test description",
                "module": "career"
            },
            "expected_status": 400
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        print(f"\nTesting: {test_case['name']}")
        
        try:
            response = requests.post(
                f"{API_BASE}/surveys",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == test_case['expected_status']:
                print(f"✅ {test_case['name']} - Correct status code")
                results.append(True)
            else:
                print(f"❌ {test_case['name']} - Expected {test_case['expected_status']}, got {response.status_code}")
                results.append(False)
                
        except Exception as e:
            print(f"❌ {test_case['name']} error: {str(e)}")
            results.append(False)
    
    return all(results)

def test_get_surveys_with_filters():
    """Test GET /api/surveys with various filters"""
    print("\n=== Testing GET /api/surveys (with filters) ===")
    
    test_cases = [
        {
            "name": "All surveys (no filter)",
            "params": {},
            "min_expected": 3  # We created 3 surveys
        },
        {
            "name": "Career module filter",
            "params": {"module": "career"},
            "min_expected": 1
        },
        {
            "name": "Education module filter", 
            "params": {"module": "education"},
            "min_expected": 1
        },
        {
            "name": "Projects module filter",
            "params": {"module": "projects"},
            "min_expected": 1
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        print(f"\nTesting: {test_case['name']}")
        
        try:
            response = requests.get(f"{API_BASE}/surveys", params=test_case['params'])
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and isinstance(data.get('data'), list):
                    surveys = data['data']
                    if len(surveys) >= test_case['min_expected']:
                        print(f"✅ {test_case['name']} - Found {len(surveys)} surveys")
                        results.append(True)
                    else:
                        print(f"❌ {test_case['name']} - Expected at least {test_case['min_expected']}, got {len(surveys)}")
                        results.append(False)
                else:
                    print(f"❌ {test_case['name']} - Invalid response structure")
                    results.append(False)
            else:
                print(f"❌ {test_case['name']} failed with status {response.status_code}")
                results.append(False)
                
        except Exception as e:
            print(f"❌ {test_case['name']} error: {str(e)}")
            results.append(False)
    
    return all(results)

def test_expiry_filtering():
    """Test survey expiry filtering"""
    print("\n=== Testing Survey Expiry Filtering ===")
    
    # Create an expired survey
    expired_survey = create_test_survey_data("career", expired=True)
    
    try:
        # Create expired survey
        response = requests.post(
            f"{API_BASE}/surveys",
            json=expired_survey,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code != 200:
            print("❌ Failed to create expired survey for testing")
            return False
        
        expired_survey_id = response.json()['data']['id']
        test_survey_ids.append(expired_survey_id)
        
        # Test without includeExpired (should filter out expired)
        response1 = requests.get(f"{API_BASE}/surveys")
        
        # Test with includeExpired=true (should include expired)
        response2 = requests.get(f"{API_BASE}/surveys", params={"includeExpired": "true"})
        
        if response1.status_code == 200 and response2.status_code == 200:
            data1 = response1.json()
            data2 = response2.json()
            
            surveys_without_expired = data1['data']
            surveys_with_expired = data2['data']
            
            print(f"Surveys without expired: {len(surveys_without_expired)}")
            print(f"Surveys with expired: {len(surveys_with_expired)}")
            
            # Should have more surveys when including expired
            if len(surveys_with_expired) > len(surveys_without_expired):
                print("✅ Expiry filtering working correctly")
                return True
            else:
                print("❌ Expiry filtering not working as expected")
                return False
        else:
            print("❌ Failed to test expiry filtering")
            return False
            
    except Exception as e:
        print(f"❌ Expiry filtering test error: {str(e)}")
        return False

def test_put_survey():
    """Test PUT /api/surveys"""
    print("\n=== Testing PUT /api/surveys ===")
    
    if not test_survey_ids:
        print("❌ No survey IDs available for update testing")
        return False
    
    survey_id = test_survey_ids[0]
    
    # Test valid update
    update_data = {
        "id": survey_id,
        "title": "Updated Survey Title",
        "description": "Updated description"
    }
    
    try:
        response = requests.put(
            f"{API_BASE}/surveys",
            json=update_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ PUT /api/surveys working for valid update")
                
                # Test update without ID
                invalid_update = {"title": "No ID provided"}
                response2 = requests.put(
                    f"{API_BASE}/surveys",
                    json=invalid_update,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response2.status_code == 400:
                    print("✅ PUT /api/surveys correctly rejects missing ID")
                    
                    # Test update non-existent survey
                    nonexistent_update = {
                        "id": str(uuid.uuid4()),
                        "title": "Non-existent survey"
                    }
                    response3 = requests.put(
                        f"{API_BASE}/surveys",
                        json=nonexistent_update,
                        headers={'Content-Type': 'application/json'}
                    )
                    
                    if response3.status_code == 404:
                        print("✅ PUT /api/surveys correctly handles non-existent survey")
                        return True
                    else:
                        print(f"❌ PUT /api/surveys - Expected 404 for non-existent survey, got {response3.status_code}")
                        return False
                else:
                    print(f"❌ PUT /api/surveys - Expected 400 for missing ID, got {response2.status_code}")
                    return False
            else:
                print("❌ PUT /api/surveys - Invalid response structure")
                return False
        else:
            print(f"❌ PUT /api/surveys failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ PUT /api/surveys error: {str(e)}")
        return False

def test_post_survey_response():
    """Test POST /api/surveys/responses"""
    print("\n=== Testing POST /api/surveys/responses ===")
    
    if not test_survey_ids:
        print("❌ No survey IDs available for response testing")
        return False
    
    survey_id = test_survey_ids[0]
    
    # Test valid response
    response_data = create_test_response_data(survey_id)
    
    try:
        response = requests.post(
            f"{API_BASE}/surveys/responses",
            json=response_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'data' in data:
                response_obj = data['data']
                if 'id' in response_obj and response_obj.get('surveyId') == survey_id:
                    print("✅ POST /api/surveys/responses working for valid data")
                    test_response_ids.append(response_obj['id'])
                    
                    # Test anonymous response (no userName/userEmail)
                    anonymous_data = {
                        "surveyId": survey_id,
                        "answers": [
                            {
                                "questionId": "q1",
                                "question": "Test question",
                                "answer": "Test answer"
                            }
                        ]
                    }
                    
                    response2 = requests.post(
                        f"{API_BASE}/surveys/responses",
                        json=anonymous_data,
                        headers={'Content-Type': 'application/json'}
                    )
                    
                    if response2.status_code == 200:
                        data2 = response2.json()
                        if data2['data'].get('userName') == 'Anoniem':
                            print("✅ POST /api/surveys/responses working for anonymous user")
                            return True
                        else:
                            print("❌ POST /api/surveys/responses - Anonymous user not handled correctly")
                            return False
                    else:
                        print(f"❌ POST /api/surveys/responses failed for anonymous user with status {response2.status_code}")
                        return False
                else:
                    print("❌ POST /api/surveys/responses - Invalid response data")
                    return False
            else:
                print("❌ POST /api/surveys/responses - Invalid response structure")
                return False
        else:
            print(f"❌ POST /api/surveys/responses failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ POST /api/surveys/responses error: {str(e)}")
        return False

def test_post_survey_response_invalid():
    """Test POST /api/surveys/responses with invalid data"""
    print("\n=== Testing POST /api/surveys/responses (invalid data) ===")
    
    test_cases = [
        {
            "name": "Missing surveyId",
            "data": {
                "answers": [{"questionId": "q1", "question": "Test?", "answer": "Yes"}]
            },
            "expected_status": 400
        },
        {
            "name": "Missing answers",
            "data": {
                "surveyId": str(uuid.uuid4())
            },
            "expected_status": 400
        },
        {
            "name": "Empty answers array",
            "data": {
                "surveyId": str(uuid.uuid4()),
                "answers": []
            },
            "expected_status": 400
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        print(f"\nTesting: {test_case['name']}")
        
        try:
            response = requests.post(
                f"{API_BASE}/surveys/responses",
                json=test_case['data'],
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == test_case['expected_status']:
                print(f"✅ {test_case['name']} - Correct status code")
                results.append(True)
            else:
                print(f"❌ {test_case['name']} - Expected {test_case['expected_status']}, got {response.status_code}")
                results.append(False)
                
        except Exception as e:
            print(f"❌ {test_case['name']} error: {str(e)}")
            results.append(False)
    
    return all(results)

def test_get_survey_responses():
    """Test GET /api/surveys/responses"""
    print("\n=== Testing GET /api/surveys/responses ===")
    
    if not test_survey_ids:
        print("❌ No survey IDs available for response retrieval testing")
        return False
    
    survey_id = test_survey_ids[0]
    
    try:
        # Test with valid surveyId
        response = requests.get(f"{API_BASE}/surveys/responses", params={"surveyId": survey_id})
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and isinstance(data.get('data'), list):
                responses = data['data']
                print(f"✅ GET /api/surveys/responses working - Found {len(responses)} responses")
                
                # Test without surveyId (should return 400)
                response2 = requests.get(f"{API_BASE}/surveys/responses")
                
                if response2.status_code == 400:
                    print("✅ GET /api/surveys/responses correctly rejects missing surveyId")
                    return True
                else:
                    print(f"❌ GET /api/surveys/responses - Expected 400 for missing surveyId, got {response2.status_code}")
                    return False
            else:
                print("❌ GET /api/surveys/responses - Invalid response structure")
                return False
        else:
            print(f"❌ GET /api/surveys/responses failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ GET /api/surveys/responses error: {str(e)}")
        return False

def test_delete_survey():
    """Test DELETE /api/surveys"""
    print("\n=== Testing DELETE /api/surveys ===")
    
    if not test_survey_ids:
        print("❌ No survey IDs available for deletion testing")
        return False
    
    # Use the last survey ID for deletion
    survey_id = test_survey_ids[-1]
    
    try:
        # Test valid deletion
        response = requests.delete(f"{API_BASE}/surveys", params={"id": survey_id})
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ DELETE /api/surveys working for valid ID")
                
                # Test deletion without ID
                response2 = requests.delete(f"{API_BASE}/surveys")
                
                if response2.status_code == 400:
                    print("✅ DELETE /api/surveys correctly rejects missing ID")
                    
                    # Test deletion of non-existent survey
                    response3 = requests.delete(f"{API_BASE}/surveys", params={"id": str(uuid.uuid4())})
                    
                    if response3.status_code == 404:
                        print("✅ DELETE /api/surveys correctly handles non-existent survey")
                        return True
                    else:
                        print(f"❌ DELETE /api/surveys - Expected 404 for non-existent survey, got {response3.status_code}")
                        return False
                else:
                    print(f"❌ DELETE /api/surveys - Expected 400 for missing ID, got {response2.status_code}")
                    return False
            else:
                print("❌ DELETE /api/surveys - Invalid response structure")
                return False
        else:
            print(f"❌ DELETE /api/surveys failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ DELETE /api/surveys error: {str(e)}")
        return False

def test_data_structure_validation():
    """Test that returned data structures match expected format"""
    print("\n=== Testing Data Structure Validation ===")
    
    if not test_survey_ids:
        print("❌ No survey IDs available for structure validation")
        return False
    
    try:
        # Get surveys and validate structure
        response = requests.get(f"{API_BASE}/surveys")
        
        if response.status_code == 200:
            data = response.json()
            surveys = data['data']
            
            if surveys:
                survey = surveys[0]
                required_fields = ['id', 'title', 'module', 'questions', 'isActive', 'createdAt', 'updatedAt']
                
                missing_fields = [field for field in required_fields if field not in survey]
                
                if not missing_fields:
                    print("✅ Survey data structure validation passed")
                    
                    # Validate questions structure
                    if survey['questions'] and isinstance(survey['questions'], list):
                        question = survey['questions'][0]
                        question_fields = ['id', 'text', 'type', 'required']
                        
                        missing_q_fields = [field for field in question_fields if field not in question]
                        
                        if not missing_q_fields:
                            print("✅ Question data structure validation passed")
                            return True
                        else:
                            print(f"❌ Question missing fields: {missing_q_fields}")
                            return False
                    else:
                        print("❌ Questions array invalid or empty")
                        return False
                else:
                    print(f"❌ Survey missing fields: {missing_fields}")
                    return False
            else:
                print("⚠️  No surveys available for structure validation")
                return True
        else:
            print(f"❌ Failed to get surveys for structure validation: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Data structure validation error: {str(e)}")
        return False

def run_all_tests():
    """Run all Survey System backend tests"""
    print("🚀 Starting Survey System Backend API Tests")
    print(f"Testing against: {API_BASE}")
    print("=" * 60)
    
    test_results = []
    
    # Test 1: GET empty surveys
    test_results.append(("GET empty surveys", test_get_surveys_empty()))
    
    # Test 2: POST valid surveys
    test_results.append(("POST valid surveys", test_post_survey_valid()))
    
    # Test 3: POST invalid surveys
    test_results.append(("POST invalid surveys", test_post_survey_invalid()))
    
    # Test 4: GET surveys with filters
    test_results.append(("GET surveys with filters", test_get_surveys_with_filters()))
    
    # Test 5: Expiry filtering
    test_results.append(("Survey expiry filtering", test_expiry_filtering()))
    
    # Test 6: PUT survey
    test_results.append(("PUT survey", test_put_survey()))
    
    # Test 7: POST survey response
    test_results.append(("POST survey response", test_post_survey_response()))
    
    # Test 8: POST invalid survey response
    test_results.append(("POST invalid survey response", test_post_survey_response_invalid()))
    
    # Test 9: GET survey responses
    test_results.append(("GET survey responses", test_get_survey_responses()))
    
    # Test 10: DELETE survey
    test_results.append(("DELETE survey", test_delete_survey()))
    
    # Test 11: Data structure validation
    test_results.append(("Data structure validation", test_data_structure_validation()))
    
    # Summary
    print("\n" + "=" * 60)
    print("🏁 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\nResults: {passed}/{total} tests passed")
    print(f"Created {len(test_survey_ids)} test surveys")
    print(f"Created {len(test_response_ids)} test responses")
    
    if passed == total:
        print("🎉 All Survey System backend tests PASSED!")
        return True
    else:
        print(f"⚠️  {total - passed} test(s) FAILED")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)