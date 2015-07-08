Foreman Tasks
=============

Tasks management engine for Foreman. Gives you an overview of what's
happening/happened in your Foreman instance. A framework for asynchronous tasks in Foreman.

* Website: [TheForeman.org](http://theforeman.org)
* ServerFault tag: [Foreman](http://serverfault.com/questions/tagged/foreman)
* Issues: [foreman-tasks Redmine](http://projects.theforeman.org/projects/foreman-tasks)
* Wiki: [Foreman wiki](http://projects.theforeman.org/projects/foreman/wiki/About)
* Community and support: #theforeman for general support, #theforeman-dev for development chat in [Freenode](irc.freenode.net)
* Mailing lists:
    * [foreman-users](https://groups.google.com/forum/?fromgroups#!forum/foreman-users)
    * [foreman-dev](https://groups.google.com/forum/?fromgroups#!forum/foreman-dev)

Installation
------------

Please see the Foreman manual for appropriate instructions:

* [Foreman: How to Install a Plugin](http://theforeman.org/manuals/latest/index.html#6.1InstallaPlugin)

### Red Hat, CentOS, Fedora, Scientific Linux (rpm)

Set up the repo as explained in the link above, then run

    # yum install ruby193-rubygem-foreman-tasks

### Bundle (gem)

Add the following to bundler.d/Gemfile.local.rb in your Foreman installation directory (/usr/share/foreman by default)

    $ gem 'foreman-tasks'

Then run `bundle install` and `foreman-rake db:migrate` from the same directory

--------------

To verify that the installation was successful, go to Foreman, top bar **Administer > About** and check 'foreman-tasks' shows up in the **System Status** menu under the Plugins tab. You should also see a **'Tasks'** button under the **Monitor** menu in the top bar.

Usage
-----

In the UI, go to `/foreman_tasks/tasks`. This should give a list of
tasks that were run in the system. It's possible to filter that using
scoped search. Possible searches:

```
# search all tasks by user
owner.login = admin
# search all tasks on architecture with id 9
resource_type = Architecture and resource_id = 9
```

Clicking on the action, it should provide more details.

Via API:

```bash
curl -k -u admin:changeme\
  https://foreman.example.com/foreman_tasks/api/tasks/b346db45-76fd-4217-9247-aac51b5cde4e -H 'Accept: application/json'
```

Features
--------

* Current tasks progress
* Audit: tasks history for resources and users
* Possibility to generate CLI examples
* Locking: connection between task and resource: allows listing tasks
  for a resource but also allows preventing to run two
  conflicting tasks on one resource.
* Dynflow integration allowing async processing, workflows definitions etc.


Dynflow Integration
-------------------

This engine is agnostic on background processing tool and can be used
with anything that allows supports some kind of execution hooks.

On the other side, since we started this as part of Katello
integration with Dynflow, the dynflow adapters are already there.

Also, since dynflow has no additional dependencies in terms of another
database (tested mainly on Postgres), this gem ships the Dynflow
setting so that Dynflow can be used directly.

It's turned off by default, but you can turn that on with putting this
code somewhere in Rails initialization process. In case of an engine,
it would be:

```ruby
initializer "your_engine.require_dynflow", :before => "foreman_tasks.initialize_dynflow" do |app|
  ForemanTasks.dynflow.require!
  ForemanTasks.dynflow.config.eager_load_paths << File.join(YourEngine::Engine.root, 'app/lib/actions')
end
```

Additionally, there are also examples of using Dynflow for async tasks
and auditing included in this repository. To enable them you just need
to set `FOREMAN_TASKS_MONKEYS` env variable to `true`

```bash
FOREMAN_TASKS_MONKEYS=true bundle exec rails s
```

The example for async tasks handling is the puppet facts import. Next
time puppet imports the facts to Foreman, the task should appear in
the tasks list.

The example for auditing features is the architecture model. On every
modification, there is a corresponding Dynflow action triggered. This
leads to it appearing in the tasks list as well, even there was no
async processing involved, but still using the same interface to
show the task.

The Dynflow console is accessible on `/foreman_tasks/dynflow` path.

## Production mode

In development mode, the Dynflow executor is part of the web server
process. However, in production, it's more than suitable to have the
web server process separated from the async executor. Therefore,
Dynflow is set to use external process in production mode by default
(can be changed with `ForemanTasks.dynflow.config.remote = false`).

The executor process needs to be executed before the web server. You
can run it by:

```
RAILS_ENV=production bundle exec rake foreman_tasks:dynflow:executor
```

Also, there is a possibility to run the executor in daemonized mode
using the `dynflow-executor`. It expects to be executed from Foreman
rails root directory. See `-h` for more details and options

Issues
------

The issues are tracked [here](http://projects.theforeman.org/projects/foreman-tasks/issues)

Documentation
-------------

TBD - dig into the code for now (happy hacking:)

Tests
-----

TBD

License
-------

GPLv3

Author
------

Ivan Nečas
