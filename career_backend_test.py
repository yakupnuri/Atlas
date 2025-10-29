#!/usr/bin/env python3
"""
Career Center Backend Test Suite for Auto-Expiry Filtering
Tests the Career Center API with automatic expiry filtering functionality
"""

import requests
import json
from datetime import datetime, timedelta
import time

# Configuration
BASE_URL = "https://stichting-atlas-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def create_test_job(title, company, description, expiry_date=None):
    """Create a test job with optional expiry date"""
    job_data = {
        "title": title,
        "company": company,
        "description": description,
        "location": "Amsterdam, NL",
        "salary": "€3000-4000",
        "requirements": "Bachelor degree required"
    }
    
    if expiry_date:
        job_data["expiryDate"] = expiry_date
    
    return job_data

def create_test_survey(title, description, end_date=None):
    """Create a test survey with optional end date"""
    survey_data = {
        "title": title,
        "description": description,
        "questions": ["What is your experience?", "How satisfied are you?"]
    }
    
    if end_date:
        survey_data["endDate"] = end_date
    
    return survey_data

def create_test_seminar(title, description, date=None, time=None):
    """Create a test seminar with optional date and time"""
    seminar_data = {
        "title": title,
        "description": description,
        "speaker": "Dr. John Doe",
        "location": "Conference Room A"
    }
    
    if date:
        seminar_data["date"] = date
    if time:
        seminar_data["time"] = time
    
    return seminar_data

def clear_career_data():
    """Clear all career data for clean testing"""
    print("\n=== Clearing Career Data ===")
    
    types = ['jobs', 'surveys', 'seminars', 'announcements']
    
    for career_type in types:
        try:
            # Get all items
            response = requests.get(f"{API_BASE}/career?type={career_type}&includeExpired=true")
            if response.status_code == 200:
                data = response.json()
                items = data.get('data', [])
                
                # Delete each item
                for item in items:
                    delete_response = requests.delete(f"{API_BASE}/career?type={career_type}&id={item['id']}")
                    if delete_response.status_code == 200:
                        print(f"✅ Deleted {career_type} item: {item.get('title', item.get('id'))}")
                    else:
                        print(f"⚠️  Failed to delete {career_type} item: {item.get('id')}")
            
        except Exception as e:
            print(f"⚠️  Error clearing {career_type}: {str(e)}")
    
    print("Career data clearing completed")

def test_jobs_expiry_filtering():
    """Test jobs with expiry date filtering"""
    print("\n=== Testing Jobs Expiry Filtering ===")
    
    # Create dates
    future_date = (datetime.now() + timedelta(days=7)).isoformat()
    past_date = (datetime.now() - timedelta(days=7)).isoformat()
    
    # Create test jobs
    future_job = create_test_job("Future Software Developer", "TechCorp", "Great opportunity", future_date)
    past_job = create_test_job("Expired Marketing Manager", "MarketCorp", "Position closed", past_date)
    no_expiry_job = create_test_job("Permanent Position", "StableCorp", "Always open")
    
    jobs_to_create = [
        ("Future job", future_job),
        ("Past job", past_job),
        ("No expiry job", no_expiry_job)
    ]
    
    created_jobs = []
    
    # Create jobs
    for job_name, job_data in jobs_to_create:
        try:
            response = requests.post(
                f"{API_BASE}/career",
                json={"type": "jobs", "data": job_data},
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                result = response.json()
                created_jobs.append(result['data'])
                print(f"✅ Created {job_name}: {job_data['title']}")
            else:
                print(f"❌ Failed to create {job_name}: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating {job_name}: {str(e)}")
            return False
    
    # Test public API (should filter expired jobs)
    try:
        response = requests.get(f"{API_BASE}/career?type=jobs")
        if response.status_code == 200:
            data = response.json()
            public_jobs = data.get('data', [])
            
            # Should only have future job and no-expiry job
            expected_titles = ["Future Software Developer", "Permanent Position"]
            actual_titles = [job['title'] for job in public_jobs]
            
            print(f"Public API returned {len(public_jobs)} jobs: {actual_titles}")
            
            if len(public_jobs) == 2 and all(title in actual_titles for title in expected_titles):
                print("✅ Public API correctly filters expired jobs")
            else:
                print(f"❌ Public API filtering failed. Expected: {expected_titles}, Got: {actual_titles}")
                return False
        else:
            print(f"❌ Public API request failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing public API: {str(e)}")
        return False
    
    # Test admin API (should include all jobs)
    try:
        response = requests.get(f"{API_BASE}/career?type=jobs&includeExpired=true")
        if response.status_code == 200:
            data = response.json()
            admin_jobs = data.get('data', [])
            
            print(f"Admin API returned {len(admin_jobs)} jobs")
            
            if len(admin_jobs) == 3:
                print("✅ Admin API correctly includes all jobs (including expired)")
            else:
                print(f"❌ Admin API should return 3 jobs, got {len(admin_jobs)}")
                return False
        else:
            print(f"❌ Admin API request failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing admin API: {str(e)}")
        return False
    
    return True

def test_surveys_expiry_filtering():
    """Test surveys with end date filtering"""
    print("\n=== Testing Surveys End Date Filtering ===")
    
    # Create dates
    future_date = (datetime.now() + timedelta(days=7)).isoformat()
    past_date = (datetime.now() - timedelta(days=7)).isoformat()
    
    # Create test surveys
    future_survey = create_test_survey("Future Employee Satisfaction Survey", "Help us improve", future_date)
    past_survey = create_test_survey("Expired Training Feedback", "Survey closed", past_date)
    no_end_survey = create_test_survey("Ongoing General Feedback", "Always accepting feedback")
    
    surveys_to_create = [
        ("Future survey", future_survey),
        ("Past survey", past_survey),
        ("No end date survey", no_end_survey)
    ]
    
    created_surveys = []
    
    # Create surveys
    for survey_name, survey_data in surveys_to_create:
        try:
            response = requests.post(
                f"{API_BASE}/career",
                json={"type": "surveys", "data": survey_data},
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                result = response.json()
                created_surveys.append(result['data'])
                print(f"✅ Created {survey_name}: {survey_data['title']}")
            else:
                print(f"❌ Failed to create {survey_name}: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating {survey_name}: {str(e)}")
            return False
    
    # Test public API (should filter expired surveys)
    try:
        response = requests.get(f"{API_BASE}/career?type=surveys")
        if response.status_code == 200:
            data = response.json()
            public_surveys = data.get('data', [])
            
            # Should only have future survey and no-end-date survey
            expected_titles = ["Future Employee Satisfaction Survey", "Ongoing General Feedback"]
            actual_titles = [survey['title'] for survey in public_surveys]
            
            print(f"Public API returned {len(public_surveys)} surveys: {actual_titles}")
            
            if len(public_surveys) == 2 and all(title in actual_titles for title in expected_titles):
                print("✅ Public API correctly filters expired surveys")
            else:
                print(f"❌ Public API filtering failed. Expected: {expected_titles}, Got: {actual_titles}")
                return False
        else:
            print(f"❌ Public API request failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing public API: {str(e)}")
        return False
    
    # Test admin API (should include all surveys)
    try:
        response = requests.get(f"{API_BASE}/career?type=surveys&includeExpired=true")
        if response.status_code == 200:
            data = response.json()
            admin_surveys = data.get('data', [])
            
            print(f"Admin API returned {len(admin_surveys)} surveys")
            
            if len(admin_surveys) == 3:
                print("✅ Admin API correctly includes all surveys (including expired)")
            else:
                print(f"❌ Admin API should return 3 surveys, got {len(admin_surveys)}")
                return False
        else:
            print(f"❌ Admin API request failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing admin API: {str(e)}")
        return False
    
    return True

def test_seminars_datetime_filtering():
    """Test seminars with date and time filtering"""
    print("\n=== Testing Seminars Date/Time Filtering ===")
    
    # Create dates and times
    future_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
    future_time = "14:00"
    
    past_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    past_time = "10:00"
    
    # Create test seminars
    future_seminar = create_test_seminar("Future AI Workshop", "Learn about AI", future_date, future_time)
    past_seminar = create_test_seminar("Past Leadership Training", "Training completed", past_date, past_time)
    no_datetime_seminar = create_test_seminar("TBD Innovation Seminar", "Date to be announced")
    
    seminars_to_create = [
        ("Future seminar", future_seminar),
        ("Past seminar", past_seminar),
        ("No date/time seminar", no_datetime_seminar)
    ]
    
    created_seminars = []
    
    # Create seminars
    for seminar_name, seminar_data in seminars_to_create:
        try:
            response = requests.post(
                f"{API_BASE}/career",
                json={"type": "seminars", "data": seminar_data},
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                result = response.json()
                created_seminars.append(result['data'])
                print(f"✅ Created {seminar_name}: {seminar_data['title']}")
            else:
                print(f"❌ Failed to create {seminar_name}: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating {seminar_name}: {str(e)}")
            return False
    
    # Test public API (should filter past seminars)
    try:
        response = requests.get(f"{API_BASE}/career?type=seminars")
        if response.status_code == 200:
            data = response.json()
            public_seminars = data.get('data', [])
            
            # Should only have future seminar and no-datetime seminar
            expected_titles = ["Future AI Workshop", "TBD Innovation Seminar"]
            actual_titles = [seminar['title'] for seminar in public_seminars]
            
            print(f"Public API returned {len(public_seminars)} seminars: {actual_titles}")
            
            if len(public_seminars) == 2 and all(title in actual_titles for title in expected_titles):
                print("✅ Public API correctly filters past seminars")
            else:
                print(f"❌ Public API filtering failed. Expected: {expected_titles}, Got: {actual_titles}")
                return False
        else:
            print(f"❌ Public API request failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing public API: {str(e)}")
        return False
    
    # Test admin API (should include all seminars)
    try:
        response = requests.get(f"{API_BASE}/career?type=seminars&includeExpired=true")
        if response.status_code == 200:
            data = response.json()
            admin_seminars = data.get('data', [])
            
            print(f"Admin API returned {len(admin_seminars)} seminars")
            
            if len(admin_seminars) == 3:
                print("✅ Admin API correctly includes all seminars (including past)")
            else:
                print(f"❌ Admin API should return 3 seminars, got {len(admin_seminars)}")
                return False
        else:
            print(f"❌ Admin API request failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing admin API: {str(e)}")
        return False
    
    return True

def test_announcements_no_filtering():
    """Test announcements (should not be filtered by date)"""
    print("\n=== Testing Announcements (No Date Filtering) ===")
    
    # Create test announcements
    announcement1 = {
        "title": "Company Update",
        "content": "Important company news",
        "priority": "high"
    }
    
    announcement2 = {
        "title": "Holiday Schedule",
        "content": "Office closure dates",
        "priority": "medium"
    }
    
    announcements_to_create = [
        ("Announcement 1", announcement1),
        ("Announcement 2", announcement2)
    ]
    
    # Create announcements
    for announcement_name, announcement_data in announcements_to_create:
        try:
            response = requests.post(
                f"{API_BASE}/career",
                json={"type": "announcements", "data": announcement_data},
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                print(f"✅ Created {announcement_name}: {announcement_data['title']}")
            else:
                print(f"❌ Failed to create {announcement_name}: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating {announcement_name}: {str(e)}")
            return False
    
    # Test public API (should return all announcements)
    try:
        response = requests.get(f"{API_BASE}/career?type=announcements")
        if response.status_code == 200:
            data = response.json()
            public_announcements = data.get('data', [])
            
            print(f"Public API returned {len(public_announcements)} announcements")
            
            if len(public_announcements) == 2:
                print("✅ Public API returns all announcements (no date filtering)")
            else:
                print(f"❌ Expected 2 announcements, got {len(public_announcements)}")
                return False
        else:
            print(f"❌ Public API request failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing public API: {str(e)}")
        return False
    
    return True

def test_api_error_handling():
    """Test API error handling scenarios"""
    print("\n=== Testing API Error Handling ===")
    
    # Test missing type parameter
    try:
        response = requests.get(f"{API_BASE}/career")
        if response.status_code == 400:
            print("✅ Missing type parameter correctly returns 400")
        else:
            print(f"❌ Expected 400 for missing type, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing missing type: {str(e)}")
        return False
    
    # Test invalid type parameter
    try:
        response = requests.get(f"{API_BASE}/career?type=invalid")
        # Should still work but return empty data
        if response.status_code == 200:
            data = response.json()
            if len(data.get('data', [])) == 0:
                print("✅ Invalid type parameter returns empty data")
            else:
                print("❌ Invalid type should return empty data")
                return False
        else:
            print(f"❌ Invalid type request failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing invalid type: {str(e)}")
        return False
    
    return True

def run_all_career_tests():
    """Run all Career Center backend tests"""
    print("🚀 Starting Career Center Auto-Expiry Backend Tests")
    print(f"Testing against: {API_BASE}")
    print("=" * 70)
    
    # Clear existing data first
    clear_career_data()
    
    test_results = []
    
    # Test 1: Jobs expiry filtering
    test_results.append(("Jobs expiry filtering", test_jobs_expiry_filtering()))
    
    # Test 2: Surveys end date filtering
    test_results.append(("Surveys end date filtering", test_surveys_expiry_filtering()))
    
    # Test 3: Seminars date/time filtering
    test_results.append(("Seminars date/time filtering", test_seminars_datetime_filtering()))
    
    # Test 4: Announcements (no filtering)
    test_results.append(("Announcements (no filtering)", test_announcements_no_filtering()))
    
    # Test 5: API error handling
    test_results.append(("API error handling", test_api_error_handling()))
    
    # Summary
    print("\n" + "=" * 70)
    print("🏁 CAREER CENTER TEST SUMMARY")
    print("=" * 70)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All Career Center auto-expiry tests PASSED!")
        return True
    else:
        print(f"⚠️  {total - passed} test(s) FAILED")
        return False

if __name__ == "__main__":
    success = run_all_career_tests()
    exit(0 if success else 1)