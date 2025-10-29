#!/usr/bin/env python3
"""
Career Center Edge Case Tests
Additional tests for edge cases and boundary conditions
"""

import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://stichting-atlas-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def test_timezone_handling():
    """Test timezone handling for date comparisons"""
    print("\n=== Testing Timezone Handling ===")
    
    # Create a job that expires in 1 minute (very close to current time)
    near_future = (datetime.now() + timedelta(minutes=1)).isoformat()
    
    job_data = {
        "title": "Near Future Job",
        "company": "TimeCorp",
        "description": "Expires very soon",
        "expiryDate": near_future
    }
    
    try:
        # Create the job
        response = requests.post(
            f"{API_BASE}/career",
            json={"type": "jobs", "data": job_data},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Created near-future job")
            
            # Immediately check if it appears in public API
            get_response = requests.get(f"{API_BASE}/career?type=jobs")
            if get_response.status_code == 200:
                data = get_response.json()
                jobs = data.get('data', [])
                
                near_future_jobs = [job for job in jobs if job['title'] == 'Near Future Job']
                
                if len(near_future_jobs) == 1:
                    print("✅ Near-future job correctly appears in public API")
                    return True
                else:
                    print("❌ Near-future job not found in public API")
                    return False
            else:
                print(f"❌ Failed to get jobs: {get_response.status_code}")
                return False
        else:
            print(f"❌ Failed to create near-future job: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing timezone handling: {str(e)}")
        return False

def test_malformed_dates():
    """Test handling of malformed date formats"""
    print("\n=== Testing Malformed Date Handling ===")
    
    # Test job with invalid date format
    job_with_bad_date = {
        "title": "Bad Date Job",
        "company": "BadDateCorp",
        "description": "Has invalid expiry date",
        "expiryDate": "not-a-date"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/career",
            json={"type": "jobs", "data": job_with_bad_date},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Job with malformed date created successfully")
            
            # Check if it appears in public API (should NOT appear since malformed date is treated as expired)
            get_response = requests.get(f"{API_BASE}/career?type=jobs")
            if get_response.status_code == 200:
                data = get_response.json()
                jobs = data.get('data', [])
                
                bad_date_jobs = [job for job in jobs if job['title'] == 'Bad Date Job']
                
                if len(bad_date_jobs) == 0:
                    print("✅ Job with malformed date correctly filtered out (treated as expired)")
                    return True
                else:
                    print("❌ Job with malformed date should be filtered out")
                    return False
            else:
                print(f"❌ Failed to get jobs: {get_response.status_code}")
                return False
        else:
            print(f"❌ Failed to create job with malformed date: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing malformed dates: {str(e)}")
        return False

def test_empty_date_fields():
    """Test handling of empty date fields"""
    print("\n=== Testing Empty Date Fields ===")
    
    # Test job with empty string expiry date
    job_with_empty_date = {
        "title": "Empty Date Job",
        "company": "EmptyDateCorp",
        "description": "Has empty expiry date",
        "expiryDate": ""
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/career",
            json={"type": "jobs", "data": job_with_empty_date},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Job with empty date created successfully")
            
            # Check if it appears in public API (should appear since date is empty)
            get_response = requests.get(f"{API_BASE}/career?type=jobs")
            if get_response.status_code == 200:
                data = get_response.json()
                jobs = data.get('data', [])
                
                empty_date_jobs = [job for job in jobs if job['title'] == 'Empty Date Job']
                
                if len(empty_date_jobs) == 1:
                    print("✅ Job with empty date appears in public API (correct behavior)")
                    return True
                else:
                    print("❌ Job with empty date not found")
                    return False
            else:
                print(f"❌ Failed to get jobs: {get_response.status_code}")
                return False
        else:
            print(f"❌ Failed to create job with empty date: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing empty date fields: {str(e)}")
        return False

def test_seminar_partial_datetime():
    """Test seminars with only date or only time (not both)"""
    print("\n=== Testing Seminar Partial Date/Time ===")
    
    # Test seminar with only date (no time)
    seminar_date_only = {
        "title": "Date Only Seminar",
        "description": "Has date but no time",
        "speaker": "Dr. Date",
        "date": (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
    }
    
    # Test seminar with only time (no date)
    seminar_time_only = {
        "title": "Time Only Seminar",
        "description": "Has time but no date",
        "speaker": "Dr. Time",
        "time": "15:00"
    }
    
    seminars_to_test = [
        ("Date only seminar", seminar_date_only),
        ("Time only seminar", seminar_time_only)
    ]
    
    for seminar_name, seminar_data in seminars_to_test:
        try:
            response = requests.post(
                f"{API_BASE}/career",
                json={"type": "seminars", "data": seminar_data},
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                print(f"✅ Created {seminar_name}")
            else:
                print(f"❌ Failed to create {seminar_name}: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating {seminar_name}: {str(e)}")
            return False
    
    # Check if they appear in public API (should appear since they don't have complete date/time)
    try:
        get_response = requests.get(f"{API_BASE}/career?type=seminars")
        if get_response.status_code == 200:
            data = get_response.json()
            seminars = data.get('data', [])
            
            partial_seminars = [s for s in seminars if 'Only Seminar' in s['title']]
            
            if len(partial_seminars) == 2:
                print("✅ Seminars with partial date/time appear in public API (correct behavior)")
                return True
            else:
                print(f"❌ Expected 2 partial seminars, found {len(partial_seminars)}")
                return False
        else:
            print(f"❌ Failed to get seminars: {get_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing partial date/time: {str(e)}")
        return False

def test_boundary_dates():
    """Test dates exactly at the boundary (current moment)"""
    print("\n=== Testing Boundary Dates ===")
    
    # Create a job that expires right now (within seconds)
    now_iso = datetime.now().isoformat()
    
    boundary_job = {
        "title": "Boundary Job",
        "company": "BoundaryCorp",
        "description": "Expires right now",
        "expiryDate": now_iso
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/career",
            json={"type": "jobs", "data": boundary_job},
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            print("✅ Created boundary job")
            
            # Check public API - this might or might not appear depending on exact timing
            get_response = requests.get(f"{API_BASE}/career?type=jobs")
            if get_response.status_code == 200:
                data = get_response.json()
                jobs = data.get('data', [])
                
                boundary_jobs = [job for job in jobs if job['title'] == 'Boundary Job']
                
                # Either result is acceptable due to timing
                if len(boundary_jobs) == 0:
                    print("✅ Boundary job filtered out (acceptable - expired)")
                elif len(boundary_jobs) == 1:
                    print("✅ Boundary job included (acceptable - not yet expired)")
                else:
                    print(f"❌ Unexpected number of boundary jobs: {len(boundary_jobs)}")
                    return False
                
                return True
            else:
                print(f"❌ Failed to get jobs: {get_response.status_code}")
                return False
        else:
            print(f"❌ Failed to create boundary job: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing boundary dates: {str(e)}")
        return False

def run_edge_case_tests():
    """Run all edge case tests"""
    print("🔍 Starting Career Center Edge Case Tests")
    print(f"Testing against: {API_BASE}")
    print("=" * 60)
    
    test_results = []
    
    # Test 1: Timezone handling
    test_results.append(("Timezone handling", test_timezone_handling()))
    
    # Test 2: Malformed dates
    test_results.append(("Malformed date handling", test_malformed_dates()))
    
    # Test 3: Empty date fields
    test_results.append(("Empty date fields", test_empty_date_fields()))
    
    # Test 4: Partial date/time for seminars
    test_results.append(("Seminar partial date/time", test_seminar_partial_datetime()))
    
    # Test 5: Boundary dates
    test_results.append(("Boundary dates", test_boundary_dates()))
    
    # Summary
    print("\n" + "=" * 60)
    print("🏁 EDGE CASE TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All edge case tests PASSED!")
        return True
    else:
        print(f"⚠️  {total - passed} test(s) FAILED")
        return False

if __name__ == "__main__":
    success = run_edge_case_tests()
    exit(0 if success else 1)