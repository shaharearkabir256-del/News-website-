"""
Backend API Tests for The Chronicle
Tests all endpoints using the public URL
"""
import requests
import sys
from datetime import datetime

class ChronicleAPITester:
    def __init__(self, base_url="https://build-now-120.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_article_id = None
        self.test_article_slug = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"❌ FAILED - Error: {str(e)}")
            return False, {}

    def test_list_articles(self):
        """Test GET /api/articles"""
        success, response = self.run_test(
            "List all articles",
            "GET",
            "articles",
            200
        )
        if success and isinstance(response, list):
            print(f"   ℹ️  Returned {len(response)} articles")
            return len(response) > 0
        return False

    def test_filter_by_category(self):
        """Test GET /api/articles?category=technology"""
        success, response = self.run_test(
            "Filter articles by category (technology)",
            "GET",
            "articles",
            200,
            params={"category": "technology"}
        )
        if success and isinstance(response, list):
            print(f"   ℹ️  Returned {len(response)} technology articles")
            # Verify all are technology category
            all_tech = all(art.get("category") == "technology" for art in response)
            if all_tech:
                print(f"   ✓ All articles are in technology category")
            else:
                print(f"   ⚠️  Some articles are not in technology category")
            return len(response) > 0 and all_tech
        return False

    def test_search_articles(self):
        """Test GET /api/articles?search=climate"""
        success, response = self.run_test(
            "Search articles for 'climate'",
            "GET",
            "articles",
            200,
            params={"search": "climate"}
        )
        if success and isinstance(response, list):
            print(f"   ℹ️  Found {len(response)} articles matching 'climate'")
            return len(response) > 0
        return False

    def test_featured_articles(self):
        """Test GET /api/articles/featured"""
        success, response = self.run_test(
            "Get featured articles (hero)",
            "GET",
            "articles/featured",
            200
        )
        if success and isinstance(response, list):
            print(f"   ℹ️  Returned {len(response)} featured articles")
            # Check if sorted by hero_rank
            if len(response) >= 2:
                ranks = [art.get("hero_rank") for art in response if art.get("hero_rank") is not None]
                is_sorted = ranks == sorted(ranks)
                if is_sorted:
                    print(f"   ✓ Articles sorted by hero_rank: {ranks}")
                else:
                    print(f"   ⚠️  Articles not properly sorted by hero_rank: {ranks}")
            return len(response) == 4
        return False

    def test_trending_articles(self):
        """Test GET /api/articles/trending"""
        success, response = self.run_test(
            "Get trending articles",
            "GET",
            "articles/trending",
            200
        )
        if success and isinstance(response, list):
            print(f"   ℹ️  Returned {len(response)} trending articles")
            # Check if sorted by trending_rank
            if len(response) >= 2:
                ranks = [art.get("trending_rank") for art in response if art.get("trending_rank") is not None]
                is_sorted = ranks == sorted(ranks)
                if is_sorted:
                    print(f"   ✓ Articles sorted by trending_rank: {ranks}")
                else:
                    print(f"   ⚠️  Articles not properly sorted by trending_rank: {ranks}")
            return len(response) == 5
        return False

    def test_opinion_articles(self):
        """Test GET /api/articles/opinion"""
        success, response = self.run_test(
            "Get opinion articles",
            "GET",
            "articles/opinion",
            200
        )
        if success and isinstance(response, list):
            print(f"   ℹ️  Returned {len(response)} opinion articles")
            # Verify all are opinion
            all_opinion = all(art.get("is_opinion") == True for art in response)
            if all_opinion:
                print(f"   ✓ All articles are opinion pieces")
            else:
                print(f"   ⚠️  Some articles are not opinion pieces")
            return len(response) == 3 and all_opinion
        return False

    def test_video_articles(self):
        """Test GET /api/articles/videos"""
        success, response = self.run_test(
            "Get video articles",
            "GET",
            "articles/videos",
            200
        )
        if success and isinstance(response, list):
            print(f"   ℹ️  Returned {len(response)} video articles")
            # Verify all are videos
            all_video = all(art.get("is_video") == True for art in response)
            if all_video:
                print(f"   ✓ All articles are video stories")
            else:
                print(f"   ⚠️  Some articles are not video stories")
            return len(response) >= 2 and all_video
        return False

    def test_get_article_by_slug(self):
        """Test GET /api/articles/{slug} and view count increment"""
        slug = "global-climate-accord-paris-emissions-2040"
        
        # First request
        success1, response1 = self.run_test(
            f"Get article by slug: {slug}",
            "GET",
            f"articles/{slug}",
            200
        )
        if not success1:
            return False
        
        views1 = response1.get("views", 0)
        print(f"   ℹ️  Initial views: {views1}")
        
        # Second request to check view increment
        success2, response2 = self.run_test(
            f"Get article again to check view increment",
            "GET",
            f"articles/{slug}",
            200
        )
        if not success2:
            return False
        
        views2 = response2.get("views", 0)
        print(f"   ℹ️  Views after second request: {views2}")
        
        if views2 > views1:
            print(f"   ✓ View count incremented correctly ({views1} → {views2})")
            return True
        else:
            print(f"   ⚠️  View count did not increment")
            return False

    def test_list_comments(self):
        """Test GET /api/articles/{slug}/comments"""
        slug = "global-climate-accord-paris-emissions-2040"
        success, response = self.run_test(
            f"List comments for article: {slug}",
            "GET",
            f"articles/{slug}/comments",
            200
        )
        if success and isinstance(response, list):
            print(f"   ℹ️  Returned {len(response)} comments")
            return True
        return False

    def test_add_comment(self):
        """Test POST /api/articles/{slug}/comments"""
        slug = "global-climate-accord-paris-emissions-2040"
        comment_data = {
            "author_name": "Test User",
            "body": "This is a test comment from the automated test suite."
        }
        success, response = self.run_test(
            f"Add comment to article: {slug}",
            "POST",
            f"articles/{slug}/comments",
            200,
            data=comment_data
        )
        if success and response.get("id"):
            print(f"   ℹ️  Comment created with ID: {response.get('id')}")
            print(f"   ✓ Comment author: {response.get('author_name')}")
            return True
        return False

    def test_create_article(self):
        """Test POST /api/articles"""
        article_data = {
            "title": "Test Article from Automated Suite",
            "summary": "This is a test article created by the automated test suite.",
            "body": "This is the body of the test article. It contains some content for testing purposes.",
            "category": "technology",
            "tags": ["test"],
            "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
            "author_name": "Test Author",
            "read_minutes": 3
        }
        success, response = self.run_test(
            "Create new article",
            "POST",
            "articles",
            200,
            data=article_data
        )
        if success and response.get("id"):
            self.test_article_id = response.get("id")
            self.test_article_slug = response.get("slug")
            print(f"   ℹ️  Article created with ID: {self.test_article_id}")
            print(f"   ℹ️  Article slug: {self.test_article_slug}")
            return True
        return False

    def test_update_article(self):
        """Test PUT /api/articles/{id}"""
        if not self.test_article_id:
            print("   ⚠️  Skipping: No test article ID available")
            return False
        
        update_data = {
            "title": "Updated Test Article Title",
            "summary": "This summary has been updated by the test suite."
        }
        success, response = self.run_test(
            f"Update article: {self.test_article_id}",
            "PUT",
            f"articles/{self.test_article_id}",
            200,
            data=update_data
        )
        if success and response.get("title") == update_data["title"]:
            print(f"   ✓ Article title updated successfully")
            return True
        return False

    def test_delete_article(self):
        """Test DELETE /api/articles/{id}"""
        if not self.test_article_id:
            print("   ⚠️  Skipping: No test article ID available")
            return False
        
        success, response = self.run_test(
            f"Delete article: {self.test_article_id}",
            "DELETE",
            f"articles/{self.test_article_id}",
            200
        )
        if success and response.get("success"):
            print(f"   ✓ Article deleted successfully")
            return True
        return False

    def test_reseed(self):
        """Test POST /api/seed"""
        success, response = self.run_test(
            "Reseed database",
            "POST",
            "seed",
            200
        )
        if success and response.get("count") == 14:
            print(f"   ✓ Database reseeded with {response.get('count')} articles")
            return True
        elif success:
            print(f"   ⚠️  Expected 14 articles, got {response.get('count')}")
            return False
        return False

    def test_categories(self):
        """Test GET /api/categories"""
        success, response = self.run_test(
            "Get categories list",
            "GET",
            "categories",
            200
        )
        if success and isinstance(response, list):
            print(f"   ℹ️  Returned {len(response)} categories")
            if len(response) == 7:
                print(f"   ✓ All 7 categories present")
                category_names = [cat.get("name") for cat in response]
                print(f"   ℹ️  Categories: {', '.join(category_names)}")
                return True
            else:
                print(f"   ⚠️  Expected 7 categories, got {len(response)}")
        return False

    def test_ticker(self):
        """Test GET /api/ticker"""
        success, response = self.run_test(
            "Get breaking news ticker",
            "GET",
            "ticker",
            200
        )
        if success and isinstance(response, list):
            print(f"   ℹ️  Returned {len(response)} ticker items")
            if len(response) == 7:
                print(f"   ✓ All 7 ticker items present")
                return True
            else:
                print(f"   ⚠️  Expected 7 ticker items, got {len(response)}")
        return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("=" * 70)
        print("THE CHRONICLE - BACKEND API TEST SUITE")
        print("=" * 70)
        print(f"Testing against: {self.base_url}")
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Run tests in logical order
        self.test_list_articles()
        self.test_filter_by_category()
        self.test_search_articles()
        self.test_featured_articles()
        self.test_trending_articles()
        self.test_opinion_articles()
        self.test_video_articles()
        self.test_get_article_by_slug()
        self.test_list_comments()
        self.test_add_comment()
        self.test_create_article()
        self.test_update_article()
        self.test_delete_article()
        self.test_categories()
        self.test_ticker()
        self.test_reseed()
        
        # Print summary
        print("\n" + "=" * 70)
        print("TEST SUMMARY")
        print("=" * 70)
        print(f"Total tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        print("=" * 70)
        
        return 0 if self.tests_passed == self.tests_run else 1

def main():
    tester = ChronicleAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())
