document.addEventListener("DOMContentLoaded", startSite);

function startSite() {
	console.clear();
	gsap.registerPlugin(ScrollTrigger);
	startBoxScroll();
	testForScroll();
	navScrollHandler();
	navScrollHandler();
	createBreadcrumbs();
	assignSectionData();
	isiSetter();
	//setSectionBackgrounds();
}

/* define the "sections" array and let it be used by other functions, particularly for creating an equal number of breadcrumbs */

function setSectionsArray() {
	const sections = gsap.utils.toArray("section");
	return sections;
}

/* assign each section an "item" dataset number, which will correspong with a breadcrumb, see below */

function assignSectionData() {
	const sections = setSectionsArray();

	sections.forEach((section, i) => {
		section.dataset.item = i + 1;
	});
}

/* function to dynamically create a sticky breadcrumb based on the number of <section> tags in the DOM and give it a corresponding "item" dataset number ***********************/

function createBreadcrumbs() {
	const sections = setSectionsArray();
	let crumbCont = document.querySelector("#breadcrumb-ul");

	sections.forEach((section, i) => {
		section = document.createElement("li");
		section.textContent = "\u2022";
		section.dataset.item = i + 1;
		crumbCont.append(section);
	});
}

/* Functions to change the breadcrumbs to match section currently in veiwport */

function eraseBreadcrumbs(erase) {
	const crumbs = gsap.utils.toArray("#breadcrumb-ul li");
	erase ? gsap.set(crumbs, { color: "#000000" }) : null;
}

function changeCrumb(e) {
	const sections = setSectionsArray();
	const crumbs = gsap.utils.toArray("#breadcrumb-ul li");
	const crumbtl = gsap.timeline();
	const hero = document.getElementById("hero-section");
	let heroItem = hero.dataset.item;
	let thisCrumb = 0;

	//give the hero section a dataset, and set it to 0
	heroItem = 0;

	function findCrumb() {
		sections.forEach((section, i) => {
			let sectionItem;
			let sectionTopPos = section.getBoundingClientRect().top;
			let sectionBottomPos = section.getBoundingClientRect().bottom;

			if (sectionTopPos <= 0 && sectionBottomPos >= window.innerHeight) {
				sectionItem = section.dataset.item;
				setCrumbColor(sectionItem);
			} else {
				null;
				//sectionItem = -1;
				//setCrumbColor(sectionItem);
			}
		});
	}

	function setCrumbColor(itemNumber) {
		//console.log(itemNumber);
		if (thisCrumb != itemNumber || itemNumber != -1) {
			thisCrumb = itemNumber;
			crumbs.forEach((crumb, i) => {
				crumb.dataset.item === thisCrumb
					? crumbtl.to(crumb, { color: "#ffffff", duration: 0.05 })
					: crumbtl.to(crumb, { color: "#000000", duration: 0.05 });
			});
		} else {
			crumbtl.to(crumbs, { color: "#000000", duration: 0.05 });
		}
	}

	findCrumb();
}

/* Function listening for scrolling to set top nav and mouse icon animation **************************/

function testForScroll() {
	gsap.set("#main-nav-fixed", { opacity: 0, padding: "0rem" });
	const mouseBump = gsap.timeline({
		ease: "power3.inOut",
		yoyo: -1,
		repeat: -1,
		repeatDelay: 0.1,
	});
	const navIn = gsap.timeline({ ease: "power2.inOut", delay: 1, paused: true });

	navIn.to("#main-nav-fixed", { opacity: 1, padding: "1rem", duration: 0.2 });
	mouseBump.to(".hero-mouse-img", { y: -20, duration: 0.3 });

	ScrollTrigger.addEventListener(
		"scrollStart",
		function () {
			mouseBump.pause();
			navIn.reverse();
		},
		{ once: true }
	);

	ScrollTrigger.addEventListener(
		"scrollEnd",
		function () {
			if (window.scrollY <= 400) {
				mouseBump.play();
				navIn.reverse();
				eraseBreadcrumbs(true);
			} else {
				navIn.play();
				mouseBump.pause();
			}
		},
		{ once: true }
	);

	//listen to window scroll to change breadcrumbs
	window.addEventListener("scroll", changeCrumb);
}

/* Function setting up videos for scroll scrubbing *************************************************/

function setVideo(thisVideo) {
	const video = document.querySelector(thisVideo);
	let src = video.currentSrc || video.src;
	//console.log(video, src);

	//Make sure the video is 'activated' on iOS
	function once(el, event, fn, opts) {
		var onceFn = function (e) {
			el.removeEventListener(event, onceFn);
			fn.apply(this, arguments);
		};

		el.addEventListener(event, onceFn, opts);
		return onceFn;
	}

	once(document.documentElement, "touchstart", function (e) {
		video.play();
		video.pause();
	});

	return video;
}

/* Function to set scroll-based animation of section content, the big dawg of all the functions */

function startBoxScroll() {
	const sections = setSectionsArray();
	let boxStartX =
		document.querySelector(".section-grid-container").offsetWidth * 1.1;
	let pinEnd = "+=6000";
	let thisEase = "power2.inOut";

	ScrollTrigger.defaults({
		toggleActions: "restart pause resume none",
		markers: false,
		scrub: 0.6,
		pin: true,
		start: "center center",
		pinSpacer: false,
		//snap: 10
	});

	//Instantiate the timelines for the content animations for each section and set the scroll trigger, define the animations

	/* Hero section animation *************************************************/

	let tl0 = gsap.timeline({
		defaults: {
			ease: "none",
		},
		scrollTrigger: {
			trigger: "#hero-section",
			endTrigger: "#goals-section",
			pin: false,
			end: "top top",
		},
	});

	tl0
		.to("#site-title", { y: -200 })
		.to("#hero-section .bg", { y: -100 }, "<")
		.to(".hero-mouse-img", { y: -200 }, "<10%")
		.to("#directional-copy", { y: -200 }, "<5%");

	/* Treatment Discussion section animation *************************************************/

	let tl1 = gsap.timeline({
		defaults: {
			ease: thisEase,
		},
		scrollTrigger: {
			trigger: "#goals-section",
			anticipatePin: 1,
			end: pinEnd,
		},
	});

	tl1
		.from("#goals-section h2", { x: -100, opacity: 0 })
		.from("#box-1-1", { x: boxStartX })
		.to("#box-1-1", { opacity: 1 }, "<")
		.from("#box-1-2", { x: boxStartX })
		.to("#box-1-2", { opacity: 1 }, "<")
		.from("#box-1-3", { x: boxStartX })
		.to("#box-1-3", { opacity: 1 }, "<")
		.from("#box-1-4", { x: boxStartX })
		.to("#box-1-4", { opacity: 1 }, "<")
		.from("#goals-section-h3, #goals-section-p", { y: 100, opacity: 0 });

	/* GRAPPA guidelines section animation *************************************************/

	let tlgl = gsap.timeline({
		defaults: {
			ease: thisEase,
		},
		scrollTrigger: {
			trigger: "#guidelines-section",
			end: pinEnd,
		},
	});

	tlgl
		.from("#guidelines-section h2", { x: -100, opacity: 0 })
		.from("#guidelines-section-h3", { x: -100, opacity: 0 })
		.fromTo("#box-2-1", { x: -boxStartX, opacity: 0 }, { x: 0, opacity: 1 })
		.fromTo("#box-2-2", { y: -400, opacity: 0 }, { y: 0, opacity: 1 })
		.fromTo("#box-2-3", { x: boxStartX, opacity: 0 }, { x: 0, opacity: 1 })
		.fromTo("#box-2-4", { x: -boxStartX, opacity: 0 }, { x: 0, opacity: 1 })
		.fromTo("#box-2-5", { y: 400, opacity: 0 }, { y: 0, opacity: 1 })
		.fromTo("#box-2-6", { x: boxStartX, opacity: 0 }, { x: 0, opacity: 1 });

	/* "Blocks" (il17a paths animations) section animation ***************************************/

	let ilParentWidth = document.querySelector(
		".path-animation-container"
	).offsetWidth;
	let ilWidth = document.querySelector(".il-17a-img").offsetWidth;
	let ilTravel = ilParentWidth - ilWidth;
	let randomRot = gsap.utils.random(-100, 100, true);

	let tlblk = gsap.timeline({
		defaults: {
			ease: "power2.inOut",
		},
		scrollTrigger: {
			trigger: "#blocks-section",
			end: pinEnd,
		},
	});

	tlblk
		.fromTo("#blocks-section h2", { opacity: 0, y: 400 }, { opacity: 1, y: 0 })
		.fromTo("#blocks-subhead-1", { opacity: 0, y: 400 }, { opacity: 1, y: 0 })
		.fromTo(
			"#blocks-adaptive",
			{ opacity: 0, y: 400, height: "0rem" },
			{ opacity: 1, y: 0, height: "14rem", delay: 0.1 },
			"<"
		)
		.to("#adaptive-il-17a", {
			keyframes: {
				x: [
					0,
					ilTravel * 0.25,
					ilTravel * 0.5,
					ilTravel * 0.75,
					ilTravel * 0.8,
				],
				y: [0, 20, -30, 10, 0],
				rotation: [0, randomRot(), randomRot(), randomRot(), randomRot()],
			},
		})
		.from("#adaptive-prod", { y: -10, opacity: 0 }, "<20%")
		.to(["#blocks-subhead-1", "#blocks-adaptive"], { opacity: 0, height: 0 })
		.fromTo("#blocks-subhead-2", { opacity: 0, y: 400 }, { opacity: 1, y: 0 })
		.fromTo(
			"#blocks-innate",
			{ opacity: 0, y: 400 },
			{ opacity: 1, y: 0, delay: 0.1 },
			"<"
		)
		.to("#innate-il-17a", {
			keyframes: {
				x: [
					0,
					ilTravel * 0.25,
					ilTravel * 0.5,
					ilTravel * 0.75,
					ilTravel * 0.8,
				],
				y: [0, 30, -20, 15, 0],
				rotation: [0, randomRot(), randomRot(), randomRot(), randomRot()],
			},
		})
		.from("#innate-prod", { y: -10, opacity: 0 }, "<20%");

	/* Video section animation *************************************************/

	let vidHeight = document.querySelector(".vid-container").offsetHeight;
	let tl2 = gsap.timeline({
		defaults: {
			/* ease: thisEase,
			duration: dur1 */
		},
		scrollTrigger: {
			trigger: "#efficacy-videos-container",
			pin: false,
			end: "+=800",
			scrub: true,
			preventOverlaps: true,
		},
	});
	let tl2video = gsap.timeline({
		defaults: {
			/* ease: thisEase,
			duration: dur1 */
		},
		scrollTrigger: {
			trigger: "#video-section",
			end: "+=25000",
			scrub: true,
			preventOverlaps: true,
		},
	});

	tl2
		.fromTo("#video-section h2", { opacity: 0, y: 400 }, { opacity: 1, y: 0 })
		.fromTo(
			"#video-section-subhead",
			{ opacity: 0, y: 400 },
			{ opacity: 1, y: 0 },
			"<10%"
		)
		.fromTo(
			"#efficacy-videos-container",
			{ opacity: 0, y: 400 },
			{ opacity: 1, y: 0, delay: 0.1 },
			"<"
		);

	tl2video
		.fromTo(
			setVideo("#vid-chapter-1"),
			{ currentTime: 0 },
			{ currentTime: setVideo("#vid-chapter-1").duration || 1 }
		)
		.set("#efficacy-chapter-1-container", { height: 0 })
		.set("#efficacy-chapter-2-container", { height: vidHeight }, "<")
		.fromTo(
			setVideo("#vid-chapter-2"),
			{ currentTime: 0 },
			{ currentTime: setVideo("#vid-chapter-2").duration || 1 }
		)
		.set("#efficacy-chapter-2-container", { height: 0 })
		.set("#efficacy-chapter-3-container", { height: vidHeight }, "<")
		.fromTo(
			setVideo("#vid-chapter-3"),
			{ currentTime: 0 },
			{ currentTime: setVideo("#vid-chapter-3").duration || 1 }
		)
		.set("#efficacy-chapter-3-container", { height: 0 })
		.set("#efficacy-chapter-4-container", { height: vidHeight }, "<")
		.fromTo(
			setVideo("#vid-chapter-4"),
			{ currentTime: 0 },
			{ currentTime: setVideo("#vid-chapter-4").duration || 1 }
		)
		.set("#efficacy-chapter-4-container", { height: 0 })
		.set("#efficacy-chapter-5-container", { height: vidHeight }, "<")
		.fromTo(
			setVideo("#vid-chapter-5"),
			{ currentTime: 0 },
			{ currentTime: setVideo("#vid-chapter-5").duration || 1 }
		)
		.set("#efficacy-chapter-5-container", { height: 0 })
		.set("#efficacy-chapter-6-container", { height: vidHeight }, "<")
		.fromTo(
			setVideo("#vid-chapter-6"),
			{ currentTime: 0 },
			{ currentTime: setVideo("#vid-chapter-6").duration || 1 }
		)
		.set("#efficacy-chapter-6-container", { height: 0 })
		.set("#efficacy-chapter-7-container", { height: vidHeight }, "<")
		.fromTo(
			setVideo("#vid-chapter-7"),
			{ currentTime: 0 },
			{ currentTime: setVideo("#vid-chapter-7").duration || 1 }
		);
	//.fromTo("#video-container", {opacity: 1}, {opacity: 0});

	/* Chart section animation *************************************************/

	let tl3 = gsap.timeline({
		defaults: {
			ease: thisEase,
		},
		scrollTrigger: {
			trigger: "#study-section",
			end: pinEnd,
		},
	});

	tl3
		.from("#study-section h2", { x: -100, opacity: 0 })
		.from("#box-3-1", { x: -boxStartX })
		.to("#box-3-1", { opacity: 1 }, "<")
		.from("#box-3-2", { x: boxStartX }, "<")
		.to("#box-3-2", { opacity: 1 }, "<")
		.fromTo(
			".pie-chart",
			{
				background:
					"radial-gradient(circle closest-side, #efefef 0, #efefef 42%, transparent 42%, transparent 70%, #efefef 0), conic-gradient(#121212 0deg, #121212 0deg, #696969 0deg, #696969 0deg, #b3b3b3 0deg, #b3b3b3 0deg, #e0e0e0 0deg, #e0e0e0 0deg)",
			},
			{
				background:
					"radial-gradient(circle closest-side, #efefef 0, #efefef 42%, transparent 42%, transparent 70%, #efefef 0), conic-gradient(#121212 0deg, #121212 100deg, #696969 100deg, #696969 150deg, #b3b3b3 150deg, #b3b3b3 240deg, #e0e0e0 240deg, #e0e0e0 360deg)",
			}
		)
		.from("#box-3-1-head-2", { opacity: 0 })
		.from("#box-3-1-p-2", { opacity: 0 }, "<");

	/* Image Gallery section animation *************************************************/

	let tl4 = gsap.timeline({
		defaults: {
			ease: thisEase,
		},
		scrollTrigger: {
			trigger: "#section-4",
			anticipatePin: 1,
			end: pinEnd,
		},
	});

	tl4
		.from("#section-4 h2", { x: -100, opacity: 0 })
		.from("#section-4 .gallery-container", { opacity: 0, y: 100 })
		.from(".gallery-p", { opacity: 0, y: 100 })
		.to("#patient-image-1", { opacity: 0 })
		.from("#patient-image-2", { opacity: 0 }, "<20%")
		.to("#patient-image-2", { opacity: 0 })
		.from("#patient-image-3", { opacity: 0 }, "<20%")
		.to("#patient-image-3", { opacity: 0 })
		.from("#patient-image-4", { opacity: 0 }, "<20%");

	/* Video Blobbing? Not sure if this is needed */

	/* setTimeout(function () {
	if (window["fetch"]) {
		fetch(src)
		.then((response) => response.blob())
		.then((response) => {
			var blobURL = URL.createObjectURL(response);

			var t = video.currentTime;
			once(document.documentElement, "touchstart", function (e) {
			video.play();
			video.pause();
			});

			video.setAttribute("src", blobURL);
			video.currentTime = t + 0.01;
		});
	}
	}, 1000); */
}

//function to cause scrolling when clicking on nav anchors

function navScrollHandler() {
	// Detect if a link's href goes to the current page
	function getSamePageAnchor(link) {
		if (
			link.protocol !== window.location.protocol ||
			link.host !== window.location.host ||
			link.pathname !== window.location.pathname ||
			link.search !== window.location.search
		) {
			return false;
		}

		return link.hash;
	}

	// Scroll to a given hash, preventing the event given if there is one
	function scrollToHash(hash, e) {
		const elem = hash ? document.querySelector(hash) : false;
		if (elem) {
			if (e) e.preventDefault();
			gsap.to(window, { scrollTo: elem });
		}
	}

	// If a link's href is within the current page, scroll to it instead
	document.querySelectorAll("a[href]").forEach((a) => {
		a.addEventListener("click", (e) => {
			scrollToHash(getSamePageAnchor(a), e);
		});
	});

	// Scroll to the element in the URL's hash on load
	scrollToHash(window.location.hash);
}

/* handle the ISI section ***********************************/

function isiSetter() {
	const isiClose = document.getElementById("isi-close-button");
	isiClose.addEventListener("click", isiTrayToggle);
	let trayToggle = false;
	const isitl = gsap.timeline({
		paused: true,
		ease: "power2.inOut",
		duration: 0.25,
	});

	isitl.to("#isi-tray", { y: -500 }).to(isiClose, { rotate: "45deg" }, "<");

	function isiTrayToggle() {
		if (!trayToggle) {
			isitl.play();
			trayToggle = true;
		} else {
			isitl.reverse();
			trayToggle = false;
		}
	}
}

// Function to set parallax animation of section backgrounds

/* function setSectionBackgrounds() {
	const tback = gsap.timeline();
	const backgrounds = gsap.utils.toArray(".bg");

	backgrounds.forEach(sectbg => {
		console.log(backgrounds.indexOf(sectbg));
	}); 

	gsap.utils.toArray(".bg").forEach(layer => {
		tback.to(layer, {yPercent: -20, ease: "none"});
	}); 
}*/
