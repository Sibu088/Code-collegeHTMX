# views.py
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from urllib.parse import parse_qs
# from .models import UserInfo

def index(request):
    return render(request, 'index.html')

def edit_profile(request, id):
    if request.headers.get('HX-Request'):
        return HttpResponse(f"""
            <form hx-put="/user/{id}" hx-target="this" hx-swap="outerHTML">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" name="name" value="Greg Lim">
                </div>
                <div class="mb-3">
                    <label for="bio" class="form-label">Bio</label>
                    <textarea class="form-control" id="bio" name="bio">Follower of Christ | Author of Best-selling Amazon Tech Books and Creator of Coding Courses</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <button type="button" hx-get="/" class="btn btn-secondary">Cancel</button>
            </form>
        """)
    return HttpResponse("Direct access not allowed")

@require_http_methods(["PUT", "POST"])
def update_profile(request, id):
    if request.headers.get('HX-Request'):
        try:
            # Use urllib.parse to properly decode form data
            form_data = parse_qs(request.body.decode('utf-8'))
            name = form_data.get('name', [''])[0]
            bio = form_data.get('bio', [''])[0]
            
            return HttpResponse(f"""
                <div class="card" style="width: 18rem;" hx-target="this" hx-swap="outerHTML">
                    <div class="card-body">
                        <h5 class="card-title">{name}</h5>
                        <p class="card-text">{bio}</p>
                        <button class="btn btn-primary" hx-get="/user/{id}/edit/">Click To Edit</button>
                    </div>
                </div>
            """)
        except Exception as e:
            return HttpResponse(f"Error processing request: {str(e)}", status=400)
            
    return HttpResponse("Method not allowed")