import pytest
from app.sources.registry import registry
from app.sources.amazon import AmazonAdapter
from app.sources.cuelinks import CuelinksAdapter
from app.sources.nykaa import NykaaAdapter
from app.sources.feed import AuthorizedFeedAdapter
from app.core.config import settings

def test_source_capabilities_distinction():
    amazon = AmazonAdapter()
    cuelinks = CuelinksAdapter()
    nykaa = NykaaAdapter()
    feed = AuthorizedFeedAdapter()

    # Cuelinks must NOT claim to have a product catalogue search
    assert cuelinks.get_capabilities().has_catalogue_search is False
    assert cuelinks.get_capabilities().has_live_prices is False
    assert cuelinks.get_capabilities().has_affiliate_links is True

    # Nykaa public affiliate tools must NOT claim to have an open developer catalogue API
    assert nykaa.get_capabilities().has_catalogue_search is False
    assert nykaa.get_capabilities().has_live_prices is False

    # Amazon PA-API has catalogue and live pricing
    assert amazon.get_capabilities().has_catalogue_search is True
    assert amazon.get_capabilities().has_live_prices is True

    # Feed has catalogue and prices
    assert feed.get_capabilities().has_catalogue_search is True

def test_unconfigured_status_reporting():
    # Without keys in environment, amazon must report unconfigured with missing credentials
    amazon = AmazonAdapter()
    # Save original
    orig_key = settings.AMAZON_ACCESS_KEY_ID
    settings.AMAZON_ACCESS_KEY_ID = None

    status = amazon.get_status_info()
    assert status.is_configured is False
    assert "AMAZON_ACCESS_KEY_ID" in status.missing_credentials

    # Restore
    settings.AMAZON_ACCESS_KEY_ID = orig_key

def test_cuelinks_link_generation():
    cuelinks = CuelinksAdapter()
    test_url = "https://www.nykaa.com/maybelline-fit-me/p/123"

    # When unconfigured, returns clean URL without fake tracking
    orig_pub = settings.CUELINKS_PUB_ID
    settings.CUELINKS_PUB_ID = None
    assert cuelinks.generate_affiliate_link(test_url) == test_url

    # When configured, returns valid tracked redirect
    settings.CUELINKS_PUB_ID = "12345"
    tracked = cuelinks.generate_affiliate_link(test_url, sub_id="user_rec_1")
    assert "links.cuelinks.com" in tracked
    assert "pub_id=12345" in tracked
    assert "subid=user_rec_1" in tracked

    # Cleanup
    settings.CUELINKS_PUB_ID = orig_pub

def test_amazon_link_generation():
    amazon = AmazonAdapter()
    test_url = "https://www.amazon.in/dp/B073X2Q1R3"

    orig_tag = settings.AMAZON_ASSOCIATE_TAG
    settings.AMAZON_ASSOCIATE_TAG = "myglowguide-21"

    tagged = amazon.generate_affiliate_link(test_url)
    assert "tag=myglowguide-21" in tagged

    settings.AMAZON_ASSOCIATE_TAG = orig_tag

