# cordova-plugin-secure-cache

This is a Cordova plugin (**currently Android only**) that provides a service
for securely storing a single blob of string data. The service is set up to only
store the data in-memory (never stored to disk). It also sets up permissions
into your manifest that make it so only the app (or other apps signed with your
key) can communicate with the cache service.

This gives your app a way to store secrets, securely, such that even if your app
is killed by the Android system, when the user opens it up again, the app can
pull out the cached data from the service (which lives on past the app).

Ok, so why do I want this? Let's say you have an app that generates a
cryptographic key from a user's password. If your app is killed, then unless you
are making the *horrible mistake* of storing the user's key on-disk, your user
will have to log in again. Users hate nothing more than logging in again. Trust
me. (Android users *HATE* this one app developer!!)

SecureCache lets you store their key in-memory such that only apps built by you
can access the key data. It doesn't have to be a key, it can be any data that
can be serialized as a string. Your imagination is the only limit!

## Before you begin

The cache service is not started automatically. **You must start it yourself**.
You start it by running any command. Any command at all. Even the
`SecureCache.stop` command will start the service (however it will then
immediately stop it so this is not a recommended way to start it).

Once started, the service will continue running until either it's stopped via
the `SecureCache.stop()` command or Android decides your service is not worth
keeping around. You can `foreground` your service to ensure it will only be
killed as a last resort (cut my life into pieces...).

## API

All functions live under the `SecureCache` namespace. All functions will start
the service if it is not already running.

All functions take a `cb`
argument, which is a function that follows the convention:

```javascript
function(err, result) { ... }
```

`err` will be null if the operation was successful, and `result` will be the
data the operation returns.

### `SecureCache.foreground(title, text, cb)`

Sets the cache service to run as a foreground service.  This means that your
app's icon shows up in the notification bar, and tapping on the notification
item opens your app. You can customize the `title` and the `text` of the
notifcation as well (both strings).

This is useful for letting the user know that you're running a service.

Also, running your service in the foreground is a good way to keep the cache
service from getting killed by the android system. Foreground services are
generally the last ones to be killed.

### `SecureCache.unforeground(cb)`

Remove the service as a foreground service. Note that the service will still be
running, and will still store the cached data, but it will *not* show in the
notification bar.

### `SecureCache.set(data, cb)`

Cache some data. `data` must be a string (`JSON.encode` is your friend here).

### `SecureCache.wipe(cb)`

Wipe the cache.

### `SecureCache.get(cb)`

Grab the data in the cache. Note that the `result` argument in the `cb` function
will the the string stored in the cache.

### `SecureCache.stop(cb)`

Stop the cache service.

## Examples

Start the service and store some secret data:

```javascript
SecureCache.foreground('Turtl auto login', 'Keeps you logged in to Turtl', function(err, res) {
    if(err) return console.error('oh no: ', err);
    SecureCache.set(JSON.stringify({secret_key: '12345'}), function(err, res) {
        if(err) return console.error('oh no: ', err);
    });
});
```

*Later that day...*

Oh no! Our app was killed!! DAMN YOU ANDROID. But wait, we can grab our data
from the cache! All is not lost!

```javascript
SecureCache.get(function(err, res) {
    if(err) return console.error('oh no: ', err);
    var data = JSON.parse(res);
    console.log('cool, got our key! why not log it out so it is not secure anymore? ', data.secret_key);
    MyApp.logUserIn(data.secret_key);
});
```

## License

MIT.

