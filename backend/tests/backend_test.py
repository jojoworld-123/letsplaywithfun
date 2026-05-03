"""Backend API tests for Computer Champ."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fallback for local test runs - read from frontend .env
    from pathlib import Path
    env_path = Path("/app/frontend/.env")
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ----- Health -----
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("ok") is True
        assert "Computer Champ" in data.get("message", "")


# ----- Students -----
class TestStudents:
    def test_create_student(self, session):
        r = session.post(f"{API}/students", json={"name": "TEST_TestKid", "student_class": "1"})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == "TEST_TestKid"
        assert data["student_class"] == "1"
        assert isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["stars"] == 0
        assert data["badges"] == []
        pytest.student_id = data["id"]

    def test_get_student(self, session):
        sid = getattr(pytest, "student_id", None)
        assert sid, "student_id missing from previous test"
        r = session.get(f"{API}/students/{sid}")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["id"] == sid
        assert data["name"] == "TEST_TestKid"
        assert data["student_class"] == "1"

    def test_get_student_not_found(self, session):
        r = session.get(f"{API}/students/nonexistent-id-xyz")
        assert r.status_code == 404


# ----- Scores -----
class TestScores:
    def test_update_score_and_persist(self, session):
        sid = getattr(pytest, "student_id", None)
        assert sid
        r = session.post(f"{API}/scores", json={
            "student_id": sid, "level_id": "learn", "stars": 3, "completed": True
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert data["stars"] == 3
        assert data["progress"]["learn"]["stars"] == 3
        assert data["progress"]["learn"]["completed"] is True

        # verify persisted via GET
        g = session.get(f"{API}/students/{sid}")
        assert g.status_code == 200
        gd = g.json()
        assert gd["stars"] == 3
        assert gd["progress"]["learn"]["stars"] == 3

    def test_score_max_stars_not_decreased(self, session):
        sid = getattr(pytest, "student_id", None)
        r = session.post(f"{API}/scores", json={
            "student_id": sid, "level_id": "learn", "stars": 1, "completed": True
        })
        assert r.status_code == 200
        # Previous stars was 3; should not decrease
        assert r.json()["progress"]["learn"]["stars"] == 3

    def test_score_badges_starter(self, session):
        sid = getattr(pytest, "student_id", None)
        # add 2 more stars to total 5 (learn=3 + picture=2)
        r = session.post(f"{API}/scores", json={
            "student_id": sid, "level_id": "picture", "stars": 2, "completed": True
        })
        assert r.status_code == 200
        data = r.json()
        assert data["stars"] == 5
        assert "starter" in data["badges"]

    def test_score_student_not_found(self, session):
        r = session.post(f"{API}/scores", json={
            "student_id": "not-a-real-id", "level_id": "learn", "stars": 1, "completed": True
        })
        assert r.status_code == 404


# ----- Certificate -----
class TestCertificate:
    def test_issue_certificate(self, session):
        sid = getattr(pytest, "student_id", None)
        assert sid
        r = session.post(f"{API}/certificate/issue", json={"student_id": sid})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert data["issued"] is True

    def test_issue_certificate_missing_id(self, session):
        r = session.post(f"{API}/certificate/issue", json={})
        assert r.status_code == 400
