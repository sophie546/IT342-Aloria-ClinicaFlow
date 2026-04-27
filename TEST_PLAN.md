# Software Test Plan - ClinicaFlow

## 1. Functional Requirements Coverage

| ID | Feature | Requirements | Test Cases |
|----|---------|--------------|------------|
| FR-01 | Authentication | User registration, login, OAuth2 | TC-001, TC-002, TC-003, TC-004 |
| FR-02 | Consultation | Create consultation, view consultations | TC-005, TC-006 |
| FR-03 | Medical Staff | View doctors, check availability | TC-007, TC-008 |
| FR-04 | Patient Queue | View queue | TC-009 |
| FR-05 | Patients | View patient list | TC-010 |
| FR-06 | Account Settings | View profile page | TC-011 |

## 2. Test Cases

| TC ID | Test Case | Steps | Expected Result |
|-------|-----------|-------|-----------------|
| TC-001 | Valid Registration | 1. Go to /register 2. Enter email/password 3. Click Register | Account created, redirect to login |
| TC-002 | Duplicate Registration | Register with existing email | Error message shown |
| TC-003 | Valid Login | Enter correct credentials | Redirect to landing page |
| TC-004 | Invalid Login | Enter wrong password | Error message shown |
| TC-005 | Create Consultation | Fill form, select doctor, click Save | Success message, consultation saved |
| TC-006 | View Consultations | Go to Appointment page | List of consultations displayed |
| TC-007 | View Doctors | Go to Medical Staff page | List of doctors displayed |
| TC-008 | Available Doctors | Check doctor dropdown in Appointment | Only available doctors shown |
| TC-009 | View Patient Queue | Go to Patient Queue page | Queue list displayed |
| TC-010 | View Patients | Go to Patients page | Patient list displayed |
| TC-011 | View Account Settings | Go to Account Settings page | Profile page loads |

## 3. Test Scripts / Test Steps

### Backend API Tests (Manual)

```bash
# Test Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Test Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Test Get Consultations
curl -X GET http://localhost:8080/api/consultations/all